from src.services.schema import SchemaService
from src.services.user import UserService


class CachedProperty(object):
    """
    Descriptor (non-data) for building an attribute on-demand on first use.
    """
    def __init__(self, factory):
        """
        <factory> is called such: factory(instance) to build the attribute.
        """
        self._attr_name = factory.__name__
        self._factory = factory

    def __get__(self, instance, owner):
        # Build the attribute.
        attr = self._factory(instance)

        # Cache the value; hide ourselves.
        setattr(instance, self._attr_name, attr)

        return attr


class ServiceController:
    def __init__(self, db, settings):
        self.db = db
        self.settings = settings

    @CachedProperty
    def schema(self):
        return SchemaService(self.db)

    @CachedProperty
    def user(self):
        return UserService(self.settings['GITHUB_CLIENT_ID'], self.settings['GITHUB_CLIENT_SECRET'])
