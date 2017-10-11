from src.services.github import GithubService
from src.services.impact_report import ImpactReportService
from src.services.import_export import ImportExportService
from src.services.libraries_io import LibrariesIOService
from src.services.original_data_importer import OriginalDataImporterService
from src.services.schema import SchemaService
from src.services.user import UserService
from src.services.zotero import ZoteroService


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

    @CachedProperty
    def original_data_importer(self):
        return OriginalDataImporterService(self.db)

    @CachedProperty
    def user(self):
        return UserService(self.settings['GITHUB_CLIENT_ID'], self.settings['GITHUB_CLIENT_SECRET'])

    @CachedProperty
    def zotero(self):
        return ZoteroService(self.db, self.settings['ZOTERO_API_KEY'])

    @CachedProperty
    def libraries_io(self):
        return LibrariesIOService(self.settings['LIBRARIES_IO_API_KEY'])

    @CachedProperty
    def impact_report(self):
        return ImpactReportService(self.db, self.github, self.libraries_io)
