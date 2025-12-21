import uuid
import time

class SessionStore:
    """
    In-memory session store.
    Later can be Redis / DB.
    """

    _store = {}

    @classmethod
    def create_session(cls, resume_data, jd_text=None):
        session_id = str(uuid.uuid4())

        cls._store[session_id] = {
            "resume": resume_data,
            "jd": jd_text,
            "created_at": time.time(),
            "analysis": None,
            "ats": None,
            "rewrite": None
        }

        return session_id

    @classmethod
    def get(cls, session_id, key):
        return cls._store.get(session_id, {}).get(key)

    @classmethod
    def set(cls, session_id, key, value):
        if session_id in cls._store:
            cls._store[session_id][key] = value
