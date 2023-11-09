from datetime import datetime

import base64
import json
import logging
from rasa.shared.core import domain

from tqdm import tqdm
from typing import Optional, Any, Dict, List, Text

import rasa.utils.io
import rasa.shared.utils.io
from rasa.shared.constants import DOCS_URL_POLICIES
from rasa.shared.core.domain import State, Domain
from rasa.shared.core import events
from rasa.core.featurizers.tracker_featurizers import (
    TrackerFeaturizer,
    MaxHistoryTrackerFeaturizer,
)
from rasa.shared.nlu.interpreter import NaturalLanguageInterpreter
from rasa.core.policies.policy import Policy, PolicyPrediction, confidence_scores_for
from rasa.shared.core.trackers import DialogueStateTracker
from rasa.shared.core.generator import TrackerWithCachedStates
from rasa.shared.utils.io import is_logging_disabled
from rasa.core.constants import MEMOIZATION_POLICY_PRIORITY

logger = logging.getLogger(__name__)

# temporary constants to support back compatibility
MAX_HISTORY_NOT_SET = -1
OLD_DEFAULT_MAX_HISTORY = 5
BESTY_POLICY_PRIORITY = 10
DEFAULT_LEARNING_STYLE = "secuencial"
LEARNING_STYLE_CONFIDENCE = 1


def count_intents_from_stories(s, story_intents):
    # this function counts the amount of intents in a story and update the ocurrences of
    # an intent in a story
    count_intents = 0
    for t in s.events:
        if isinstance(t, events.UserUttered):
            intent = t.as_dict().get("parse_data").get("intent").get("name")
            story_intents[intent] = story_intents[intent] + 1
            count_intents = count_intents + 1
    return count_intents


class TestPolicy(Policy):
    last_action_timestamp = 0
    answered = False

    learning_style_answers = {"quiz": None}

    def __init__(
        self,
        featurizer: Optional[TrackerFeaturizer] = None,
        priority: int = BESTY_POLICY_PRIORITY,
        usertype: Optional[dict] = None,
        story_profiles: Optional[dict] = None,
        learning_style: Optional[str] = None,
        **kwargs: Any,
    ) -> None:
        super().__init__(featurizer, priority, **kwargs)
        self.story_profiles = story_profiles if story_profiles is not None else {}
        self.usertype = usertype if usertype is not None else {}
        self.learning_style = (
            learning_style if learning_style is not None else DEFAULT_LEARNING_STYLE
        )

    def train(
        self,
        training_trackers: List[TrackerWithCachedStates],
        domain: Domain,
        interpreter: NaturalLanguageInterpreter,
        **kwargs: Any,
    ) -> None:
        # only original stories
        training_trackers = [
            t
            for t in training_trackers
            if not hasattr(t, "is_augmented") or not t.is_augmented
        ]
        stories = {}
        amount_intents = {}
        for s in training_trackers:
            story_name = s.as_dialogue().as_dict().get("name")
            # initialize dict with intents as keys and 0 counts in each history
            if story_name not in stories.keys():
                # if the story does not exist, is added to the dictionary and the ocurrences of intents are updated
                story_intents = dict.fromkeys(domain.intents, 0)
                count_intents = count_intents_from_stories(s, story_intents)
                stories.update({story_name: story_intents})
                amount_intents.update({story_name: count_intents})
                self.usertype.update({story_name: 0.0})
            else:
                # if the story already exists, is updated in the dictionary and the ocurrences of intents are added
                aux_intents = stories.get(story_name)
                count_intents = amount_intents.get(
                    story_name
                ) + count_intents_from_stories(s, aux_intents)
                amount_intents.update({story_name: count_intents})
                stories.update({story_name: aux_intents})

        # here the training calculates the probability of ocurrence of each intent for each learning style
        for story_name in stories:
            for intent in stories.get(story_name):
                stories.get(story_name).update(
                    {
                        intent: stories.get(story_name).get(intent)
                        / amount_intents.get(story_name)
                    }
                )
        """Trains the policy on given training trackers.

		Args:
			training_trackers:
				the list of the :class:`rasa.core.trackers.DialogueStateTracker`
			domain: the :class:`rasa.shared.core.domain.Domain`
			interpreter: Interpreter which can be used by the polices for featurization.
		"""
        pass

    def predict_action_probabilities(
        self,
        tracker: DialogueStateTracker,
        domain: Domain,
        interpreter: NaturalLanguageInterpreter,
        **kwargs: Any,
    ) -> PolicyPrediction:
        if tracker.latest_message.text == "/restart":
            return self._prediction(
                confidence_scores_for("action_restart", 1.0, domain)
            )
        else:
            return self._prediction(confidence_scores_for("action_quiz", 1.0, domain))

    def _metadata(self) -> Dict[Text, Any]:
        return {
            "priority": self.priority,
            "story_profiles": self.story_profiles,
            "usertype": self.usertype,
        }

    @classmethod
    def _metadata_filename(cls) -> Text:
        return "test_policy.json"
