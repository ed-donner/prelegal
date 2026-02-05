"""Authentication business logic."""

from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import User
from core.security import verify_password, get_password_hash, create_access_token


class AuthService:
    """Handles authentication business logic."""

    def __init__(self, db: Session):
        self.db = db

    def signup(self, email: str, password: str) -> tuple[User, str]:
        """
        Register a new user.
        Returns: (user, token)
        Raises: HTTPException if email already exists or password too short
        """
        if len(password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

        hashed_password = get_password_hash(password)
        user = User(email=email, hashed_password=hashed_password)

        try:
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(status_code=400, detail="Email already registered")

        token = create_access_token(user.id, user.email)
        return user, token

    def signin(self, email: str, password: str) -> tuple[User, str]:
        """
        Authenticate a user.
        Returns: (user, token)
        Raises: HTTPException if credentials invalid
        """
        user = self.db.query(User).filter(User.email == email).first()

        # Constant-time verification to prevent timing attacks
        if user:
            password_valid = verify_password(password, user.hashed_password)
        else:
            # Perform dummy verification to maintain constant timing
            verify_password(password, "$2b$12$REuOu6.NifRKAB0krbBuzuEJaX7f.oZS5I9C/RZQLWESR.jIgpZ3C")
            password_valid = False

        if not password_valid:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token(user.id, user.email)
        return user, token

    def get_user_by_id(self, user_id: int) -> User:
        """
        Get user by ID.
        Raises: HTTPException if user not found
        """
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
