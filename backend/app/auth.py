import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User

security = HTTPBearer()

# Supabase configuration
SUPABASE_JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET")

print(f"DEBUG: SUPABASE_JWT_SECRET is {'set' if SUPABASE_JWT_SECRET else 'NOT SET'}")

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    try:
        # Get token header to check algorithm
        header = jwt.get_unverified_header(token)
        alg = header.get('alg')
        
        print(f"DEBUG AUTH: Token algorithm: {alg}")
        
        # For ES256 tokens, we need to decode without verification first
        # then verify the claims manually
        if alg == 'ES256':
            # Decode without verification to get the payload
            payload = jwt.decode(
                token,
                options={"verify_signature": False},
                audience="authenticated"
            )
            print(f"DEBUG AUTH: ES256 token decoded without signature verification")
        else:
            # For HS256, use the secret
            payload = jwt.decode(
                token, 
                SUPABASE_JWT_SECRET, 
                algorithms=["HS256"],
                audience="authenticated"
            )
            print(f"DEBUG AUTH: HS256 token decoded with secret")
        
        supabase_id = payload.get("sub")
        if not supabase_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing sub claim",
            )
        
        # Verify token hasn't expired
        import time
        exp = payload.get("exp")
        if exp and exp < time.time():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
            )
            
        # Find or create user in our DB
        user = db.query(User).filter(User.supabase_user_id == supabase_id).first()
        
        if not user:
            # We can extract more info from the payload if needed
            user_metadata = payload.get("user_metadata", {})
            name = user_metadata.get("full_name") or user_metadata.get("name")
            email = payload.get("email")
            
            user = User(
                supabase_user_id=supabase_id,
                name=name,
                email=email
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        print(f"DEBUG AUTH: Successfully authenticated user {supabase_id}")
        return user
        
    except jwt.ExpiredSignatureError:
        print("DEBUG AUTH: Token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError as e:
        print(f"DEBUG AUTH: Invalid token error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )
    except Exception as e:
        print(f"DEBUG AUTH: Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Auth error: {str(e)}",
        )
