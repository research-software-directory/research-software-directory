"""
Communication with Google Big Query (to get Github archived data)
"""

from google.cloud import bigquery

a = None

def github_events(repo_url):
    bigquery_client = bigquery.Client()
    global a
    a = bigquery_client.run_sync_query("""
    SELECT
      -- ISO 8601 formatted datetime string
      STRFTIME_UTC_USEC(created_at, "%Y-%m-%dT%H:%M:%SZ") AS created_at,
      type,
      repo.url,
      actor.url
    FROM
      [githubarchive:year.2011],
      [githubarchive:year.2012],
      [githubarchive:year.2013],
      [githubarchive:year.2014],
      [githubarchive:year.2015]
    WHERE
      org.url = 'https://api.github.com/orgs/NLeSC'
    """)

    print(a)














"""
SELECT
  -- ISO 8601 formatted datetime string
  STRFTIME_UTC_USEC(created_at, "%Y-%m-%dT%H:%M:%SZ") AS created_at,
  type,
  repo.url,
  actor.url
FROM
  [githubarchive:year.2011],
  [githubarchive:year.2012],
  [githubarchive:year.2013],
  [githubarchive:year.2014],
  [githubarchive:year.2015]
WHERE
  repo.url = 'https://api.github.com/orgs/NLeSC'
"""


"""
'3D-e-Chem/3D-e-Chem-VM',
'NLeSC/ahn-pointcloud-viewer',
'amusecode/amuse',
'NLeSC/Cesium-NcWMS',
'casacore/casacore',
'apache/couchdb',
'NLeSC/Chemical-Analytics-Platform',
'dalesteam/dales',
'MonetDB/data-vaults',
'NLeSC/DifferentialEvolution',
'NLeSC/docker-couch-admin',
'NLeSC/eAstroViz',
'NLeSC/eEcology-Annotation-WS',
'NLeSC/eEcology-script-wrapper',
'eWaterCycle/eWaterleaf',
'NLeSC/cptm',
'NLeSC/ExtJS-DateTime',
'NLeSC/ODEX-FAIRDataPoint',
'scottleedavis/googleearthtoolbox',
'3D-e-Chem/tycho-knime-node-archetype',
'benvanwerkhoven/kernel_tuner',
'interedition/collatex',
'3D-e-Chem/knime-molviewer',
'TNOCS/csWeb',
'NLeSC/Osmium',
'NLeSC/eSalsa-MPI',
'NLeSC/Massive-PotreeConverter',
'jspaaks/matrix-of-scatter',
'NLeSC/mcfly',
'nlesc-sherlock/metrochartjs',
'NLeSC/esibayes',
'rvanharen/netcdf2littler',
'NLeSC/noodles',
'NLeSC/osmium',
'NLeSC/PattyData',
'NLeSC/PattyAnalytics',
'3D-e-Chem/knime-gpcrdb',
'NLeSC/pattyvis',
'AnalyticalGraphicsInc/cesium',
'3D-e-Chem/knime-klifs',
'potree/PotreeConverter',
'nlesc-sherlock/punchcardjs',
'NLeSC/pycoeman',
'ImproPhoto/pymicmac',
'NLeSC/python-pcl',
'NLeSC/pyxenon',
'usethesource/rascal',
'rdkit/rdkit',
'nlesc/root-roofit-dev',
'nlesc-sherlock/Rig',
'recipy/recipy',
'NLeSC/structure-from-motion',
'NLeSC/SalientDetector-python',
'nlesc-sherlock/spiraljs',
'NLeSC/UncertaintyVisualization',
'HuygensING/langident',
'rudi-cilibrasi/libcomplearn',
'sara-nl/picasclient',
'UUDigitalHumanitieslab/texcavator',
'HuygensING/timbuctoo',
'rvanharen/wrfpy',
'NLeSC/xtas',
'NLeSC/Xenon',
'potree/potree'
"""


"""
SELECT
      -- ISO 8601 formatted datetime string
      STRFTIME_UTC_USEC(created_at, "%Y-%m-%dT%H:%M:%SZ") AS created_at,
      type,
      repo.url,
      actor.url
    FROM
      [githubarchive:year.2011],
      [githubarchive:year.2012],
      [githubarchive:year.2013],
      [githubarchive:year.2014],
      [githubarchive:year.2015],
      [githubarchive:year.2016],
      (TABLE_DATE_RANGE([githubarchive:day.],
          TIMESTAMP('2017-01-01'),
          TIMESTAMP('2017-08-29')
        )) WHERE
      repo.url in (
'https://api.github.com/repos/3D-e-Chem/3D-e-Chem-VM',
'https://api.github.com/repos/NLeSC/ahn-pointcloud-viewer',
'https://api.github.com/repos/amusecode/amuse',
'https://api.github.com/repos/NLeSC/Cesium-NcWMS',
'https://api.github.com/repos/casacore/casacore',
'https://api.github.com/repos/apache/couchdb',
'https://api.github.com/repos/NLeSC/Chemical-Analytics-Platform',
'https://api.github.com/repos/dalesteam/dales',
'https://api.github.com/repos/MonetDB/data-vaults',
'https://api.github.com/repos/NLeSC/DifferentialEvolution',
'https://api.github.com/repos/NLeSC/docker-couch-admin',
'https://api.github.com/repos/NLeSC/eAstroViz',
'https://api.github.com/repos/NLeSC/eEcology-Annotation-WS',
'https://api.github.com/repos/NLeSC/eEcology-script-wrapper',
'https://api.github.com/repos/eWaterCycle/eWaterleaf',
'https://api.github.com/repos/NLeSC/cptm',
'https://api.github.com/repos/NLeSC/ExtJS-DateTime',
'https://api.github.com/repos/NLeSC/ODEX-FAIRDataPoint',
'https://api.github.com/repos/scottleedavis/googleearthtoolbox',
'https://api.github.com/repos/3D-e-Chem/tycho-knime-node-archetype',
'https://api.github.com/repos/benvanwerkhoven/kernel_tuner',
'https://api.github.com/repos/interedition/collatex',
'https://api.github.com/repos/3D-e-Chem/knime-molviewer',
'https://api.github.com/repos/TNOCS/csWeb',
'https://api.github.com/repos/NLeSC/Osmium',
'https://api.github.com/repos/NLeSC/eSalsa-MPI',
'https://api.github.com/repos/NLeSC/Massive-PotreeConverter',
'https://api.github.com/repos/jspaaks/matrix-of-scatter',
'https://api.github.com/repos/NLeSC/mcfly',
'https://api.github.com/repos/nlesc-sherlock/metrochartjs',
'https://api.github.com/repos/NLeSC/esibayes',
'https://api.github.com/repos/rvanharen/netcdf2littler',
'https://api.github.com/repos/NLeSC/noodles',
'https://api.github.com/repos/NLeSC/osmium',
'https://api.github.com/repos/NLeSC/PattyData',
'https://api.github.com/repos/NLeSC/PattyAnalytics',
'https://api.github.com/repos/3D-e-Chem/knime-gpcrdb',
'https://api.github.com/repos/NLeSC/pattyvis',
'https://api.github.com/repos/AnalyticalGraphicsInc/cesium',
'https://api.github.com/repos/3D-e-Chem/knime-klifs',
'https://api.github.com/repos/potree/PotreeConverter',
'https://api.github.com/repos/nlesc-sherlock/punchcardjs',
'https://api.github.com/repos/NLeSC/pycoeman',
'https://api.github.com/repos/ImproPhoto/pymicmac',
'https://api.github.com/repos/NLeSC/python-pcl',
'https://api.github.com/repos/NLeSC/pyxenon',
'https://api.github.com/repos/usethesource/rascal',
'https://api.github.com/repos/rdkit/rdkit',
'https://api.github.com/repos/nlesc/root-roofit-dev',
'https://api.github.com/repos/nlesc-sherlock/Rig',
'https://api.github.com/repos/recipy/recipy',
'https://api.github.com/repos/NLeSC/structure-from-motion',
'https://api.github.com/repos/NLeSC/SalientDetector-python',
'https://api.github.com/repos/nlesc-sherlock/spiraljs',
'https://api.github.com/repos/NLeSC/UncertaintyVisualization',
'https://api.github.com/repos/HuygensING/langident',
'https://api.github.com/repos/rudi-cilibrasi/libcomplearn',
'https://api.github.com/repos/sara-nl/picasclient',
'https://api.github.com/repos/UUDigitalHumanitieslab/texcavator',
'https://api.github.com/repos/HuygensING/timbuctoo',
'https://api.github.com/repos/rvanharen/wrfpy',
'https://api.github.com/repos/NLeSC/xtas',
'https://api.github.com/repos/NLeSC/Xenon',
'https://api.github.com/repos/potree/potree'
)

"""