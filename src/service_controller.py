from src.services.github import GithubService
from src.services.import_export import ImportExportService
from src.services.schema import SchemaService


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
    def github(self):
        return GithubService(self.db, self.settings['GITHUB_ACCESS_TOKEN'])

    @CachedProperty
    def import_export(self):
        return ImportExportService(self.db,
                                   self.settings['DATABASE_HOST'],
                                   self.settings['DATABASE_PORT'],
                                   self.settings['DATABASE_NAME'])

    @CachedProperty
    def schema(self):
        return SchemaService(self.db)
