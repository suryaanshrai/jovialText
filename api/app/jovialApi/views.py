from django.http import JsonResponse
from rest_framework import permissions, viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import CursorPagination
from .models import User, Follower, Like, Post

from jovialApi.serializers import UserSerializer, PostListSerializer, FollowerSerializer, LikeSerializer



class LikeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows likes to be viewed or edited.
    """
    queryset = Like.objects.all().order_by('-created')
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Like.objects.filter(username=self.request.user)

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)



class FollowerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows followers to be viewed or edited.
    """
    queryset = Follower.objects.all().order_by('-created')
    serializer_class = FollowerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Follower.objects.filter(username=self.request.user)

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)
        
        
        
        
class IsPostOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.username.id == request.user.id

class PostPagination(CursorPagination):
    page_size=10
    
    
class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows posts to be viewed or edited.
    """
    queryset = Post.objects.all().order_by('-created')
    permission_classes = [IsAuthenticatedOrReadOnly, IsPostOwnerOrReadOnly]
    pagination_class = PostPagination
    
    def get_serializer_class(self):
        # if self.action == 'retrieve':
        #     return PostDetailSerializer
        return PostListSerializer
        
    
    def perform_create(self, serializer):
        serializer.save(username=self.request.user)



class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.id == request.user.id

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self,):
        if self.action == 'list':
            if self.request.user.is_authenticated:
                return User.objects.filter(username=self.request.user.username) 
            return User.objects.none()
        return User.objects.all()

    def create(self, request, *args, **kwargs):
        raise PermissionDenied("You do not have permission to create a new user.")




class PositivePostsPagination(CursorPagination):
    page_size = 10
    ordering = '-sentiment'

class PositivePostsViewset(viewsets.ReadOnlyModelViewSet):
    queryset = Post.objects.all().order_by('-sentiment')
    serializer_class = PostListSerializer
    pagination_class = PositivePostsPagination




from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

class CustomOAuth2Client(OAuth2Client):
    def __init__(
        self,
        request,
        consumer_key,
        consumer_secret,
        access_token_method,
        access_token_url,
        callback_url,
        _scope,  # This is fix for incompatibility between django-allauth==65.3.1 and dj-rest-auth==7.0.1
        scope_delimiter=" ",
        headers=None,
        basic_auth=False,
    ):
        super().__init__(
            request,
            consumer_key,
            consumer_secret,
            access_token_method,
            access_token_url,
            callback_url,
            scope_delimiter,
            headers,
            basic_auth,
        )

class GoogleLogin(SocialLoginView): 
    """
    Authentication using Google OAuth2. Post your obtained code here to register/login.
    """
    adapter_class = GoogleOAuth2Adapter
    callback_url = 'http://localhost:5173/auth/google/'
    client_class = CustomOAuth2Client