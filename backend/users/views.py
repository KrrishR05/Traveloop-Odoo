from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import (
    RegisterSerializer, LoginSerializer, ForgotPasswordSerializer,
    UserProfileSerializer, ProfileUpdateSerializer,
    GoogleLoginSerializer, PhoneLoginSerializer, OTPVerifySerializer,
)

# In-memory OTP store for demo purposes
_otp_store = {}


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer


# ── Auth Views ──────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Create a new user account and return an auth token."""
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()
    token, _ = Token.objects.get_or_create(user=user)
    profile = UserProfile.objects.get(user=user)

    return Response({
        'token': token.key,
        'user': UserProfileSerializer(profile).data,
        'message': 'Account created successfully!',
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Authenticate user and return an auth token."""
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    password = serializer.validated_data['password']

    # Find user by email
    try:
        user_obj = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'error': 'Invalid email or password.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # Authenticate with username (Django default)
    user = authenticate(username=user_obj.username, password=password)
    if user is None:
        return Response(
            {'error': 'Invalid email or password.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    token, _ = Token.objects.get_or_create(user=user)

    # Ensure profile exists
    profile, _ = UserProfile.objects.get_or_create(user=user)

    return Response({
        'token': token.key,
        'user': UserProfileSerializer(profile).data,
        'message': 'Login successful!',
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Delete the user's auth token (server-side invalidation)."""
    try:
        request.user.auth_token.delete()
    except Exception:
        pass
    return Response({'message': 'Logged out successfully.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password_view(request):
    """Direct password reset (no email verification — hackathon mode)."""
    serializer = ForgotPasswordSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    new_password = serializer.validated_data['new_password']

    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()

        # Delete old tokens so user must re-login
        Token.objects.filter(user=user).delete()

        return Response({'message': 'Password reset successfully! Please login with your new password.'})
    except User.DoesNotExist:
        return Response(
            {'error': 'No account found with this email.'},
            status=status.HTTP_404_NOT_FOUND,
        )


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Get or update the authenticated user's profile."""
    profile, _ = UserProfile.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        return Response(UserProfileSerializer(profile).data)

    # PATCH — update profile
    serializer = ProfileUpdateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data

    # Update User model fields
    if 'first_name' in data:
        request.user.first_name = data['first_name']
    if 'last_name' in data:
        request.user.last_name = data['last_name']
    request.user.save()

    # Update UserProfile fields
    if 'bio' in data:
        profile.bio = data['bio']
    if 'location' in data:
        profile.location = data['location']
    if 'phone' in data:
        profile.phone = data['phone']
    if 'avatar_url' in data:
        profile.avatar_url = data['avatar_url']
    profile.save()

    return Response({
        'user': UserProfileSerializer(profile).data,
        'message': 'Profile updated successfully!',
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def google_login_view(request):
    """Google Sign-In (demo) — create or find user by email, return token."""
    serializer = GoogleLoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    email = data['email']
    first_name = data.get('first_name', email.split('@')[0])
    last_name = data.get('last_name', '')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Auto-register
        username = email.lower().split('@')[0]
        base = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f'{base}{counter}'
            counter += 1

        user = User.objects.create_user(
            username=username, email=email,
            password=User.objects.make_random_password(),
            first_name=first_name, last_name=last_name,
        )
        profile = UserProfile.objects.create(user=user)
        if data.get('avatar_url'):
            profile.avatar_url = data['avatar_url']
            profile.save()

    token, _ = Token.objects.get_or_create(user=user)
    profile, _ = UserProfile.objects.get_or_create(user=user)

    return Response({
        'token': token.key,
        'user': UserProfileSerializer(profile).data,
        'message': 'Google login successful!',
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def phone_login_view(request):
    """Send OTP to phone number (demo — OTP is always 123456)."""
    serializer = PhoneLoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    phone = serializer.validated_data['phone']
    otp = '123456'  # Demo OTP
    _otp_store[phone] = otp
    print(f'[OTP] Code for {phone}: {otp}')

    return Response({
        'message': f'OTP sent to {phone}',
        'demo_otp': otp,  # Exposed for demo/hackathon
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp_view(request):
    """Verify OTP and authenticate user."""
    serializer = OTPVerifySerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    phone = serializer.validated_data['phone']
    otp = serializer.validated_data['otp']

    stored = _otp_store.get(phone)
    if stored != otp:
        return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

    # Clear used OTP
    _otp_store.pop(phone, None)

    # Find or create user by phone
    try:
        profile = UserProfile.objects.get(phone=phone)
        user = profile.user
    except UserProfile.DoesNotExist:
        username = f'phone_{phone[-4:]}'
        base = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f'{base}{counter}'
            counter += 1

        user = User.objects.create_user(
            username=username, email='',
            password=User.objects.make_random_password(),
        )
        profile = UserProfile.objects.create(user=user, phone=phone)

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        'token': token.key,
        'user': UserProfileSerializer(profile).data,
        'message': 'Phone verified successfully!',
    })

