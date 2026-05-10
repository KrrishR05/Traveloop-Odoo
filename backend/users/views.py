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
)


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
