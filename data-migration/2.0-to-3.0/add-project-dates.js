/* global db */

const data = [
  {
    dateEnd: '2018-04-30',
    dateStart: '2014-12-18',
    slug: '3d-e-chem'
  },
  {
    dateEnd: '2018-03-31',
    dateStart: '2016-11-01',
    slug: '3d-printing-of-human-body-parts'
  },
  {
    dateEnd: '2017-06-30',
    dateStart: '2013-12-18',
    slug: 'a-jungle-computing-approach-to-large-scale-online-forensic-analysis'
  },
  {
    dateEnd: '2022-03-01',
    dateStart: '2017-12-18',
    slug: 'a-light-in-the-dark'
  },
  {
    dateEnd: '2021-02-01',
    dateStart: '2016-12-12',
    slug: 'a-methodology-and-ecosystem-for-many-core-programming'
  },
  {
    dateEnd: '2022-12-31',
    dateStart: '2019-06-06',
    slug: 'a-new-perspective-on-global-vegetation-water-dynamics-from-radar-satellite-data'
  },
  {
    dateEnd: '2021-12-31',
    dateStart: '2017-12-18',
    slug: 'a-phase-field-model-to-guide-the-development-and-design-of-next-generation-solid-state-batteries'
  },
  {
    dateEnd: '2021-08-31',
    dateStart: '2015-12-07',
    slug: 'aa-alert'
  },
  {
    dateEnd: '2017-03-31',
    dateStart: '2013-12-18',
    slug: 'abc-muse'
  },
  {
    dateEnd: '2021-05-31',
    dateStart: '2015-12-07',
    slug: 'algorithmic-geo-visualization'
  },
  {
    dateEnd: '2015-04-24',
    dateStart: '2012-09-10',
    slug: 'amuse'
  },
  {
    dateEnd: '2016-12-31',
    dateStart: '2015-06-01',
    slug: 'andi'
  },
  {
    dateEnd: '2019-03-01',
    dateStart: '2016-12-19',
    slug: 'autograph'
  },
  {
    dateEnd: '2018-06-20',
    dateStart: '2016-12-20',
    slug: 'automated-analysis-of-online-behaviour-on-social-media'
  },
  {
    dateEnd: '2020-12-31',
    dateStart: '2015-12-07',
    slug: 'automated-parallel-calculation-of-collaborative-statistical-models'
  },
  {
    dateEnd: '2015-09-10',
    dateStart: '2013-12-16',
    slug: 'beyond-the-book'
  },
  {
    dateEnd: '2015-06-23',
    dateStart: '2013-12-18',
    slug: 'big-data-analytics-in-the-geo-spatial-domain'
  },
  {
    dateEnd: '2016-10-01',
    dateStart: '2012-05-31',
    slug: 'biographynet'
  },
  {
    dateEnd: '2015-11-30',
    dateStart: '2012-01-20',
    slug: 'biomarker-boosting'
  },
  {
    dateEnd: '2017-06-01',
    dateStart: '2016-06-01',
    slug: 'birdradar'
  },
  {
    dateEnd: '2021-02-28',
    dateStart: '2016-12-01',
    slug: 'blue-action'
  },
  {
    dateEnd: '2019-12-31',
    dateStart: '2017-09-01',
    slug: 'bridging-the-gap'
  },
  {
    dateEnd: '2019-09-03',
    dateStart: '2014-12-18',
    slug: 'candygene'
  },
  {
    dateEnd: '2025-03-01',
    dateStart: '2019-12-18',
    slug: 'carrier'
  },
  {
    dateEnd: '2017-09-30',
    dateStart: '2016-10-01',
    slug: 'case-law-analytics'
  },
  {
    dateEnd: '2015-09-07',
    dateStart: '2014-04-18',
    slug: 'chemical-analytics-platform'
  },
  {
    dateEnd: '2015-05-19',
    dateStart: '2012-01-20',
    slug: 'chemical-informatics-for-metabolite-identification-and-biochemical-network-reconstruction'
  },
  {
    dateEnd: '2023-05-16',
    dateStart: '2019-05-16',
    slug: 'cheops'
  },
  {
    dateEnd: '2018-06-20',
    dateStart: '2016-12-19',
    slug: 'city-cloud'
  },
  {
    dateEnd: '2016-12-01',
    dateStart: '2016-04-04',
    slug: 'classifying-activity-types'
  },
  {
    dateEnd: '2015-12-31',
    dateStart: '2015-05-01',
    slug: 'compressing-the-sky-into-a-large-collection-of-statistical-models'
  },
  {
    dateEnd: '2022-06-30',
    dateStart: '2017-12-18',
    slug: 'computation-of-the-optical-properties-of-nano-structures'
  },
  {
    dateEnd: '2017-12-01',
    dateStart: '2014-12-18',
    slug: 'computational-chemistry-made-easy'
  },
  {
    dateEnd: '2020-12-31',
    dateStart: '2019-12-01',
    slug: 'copernicus-attribution'
  },
  {
    dateEnd: '2021-12-01',
    dateStart: '2019-12-01',
    slug: 'cortex'
  },
  {
    dateEnd: '2020-12-31',
    dateStart: '2020-04-15',
    slug: 'covid-19-grand-challenge'
  },
  {
    dateEnd: '2015-10-01',
    dateStart: '2012-01-20',
    slug: 'creation-of-food-specific-ontologies-for-food-focused-text-mining'
  },
  {
    dateEnd: '2022-07-01',
    dateStart: '2019-12-18',
    slug: 'darkgenerators'
  },
  {
    dateEnd: '2018-06-20',
    dateStart: '2016-12-20',
    slug: 'data-mining-tools-for-abrupt-climate-change'
  },
  {
    dateEnd: '2018-07-31',
    dateStart: '2016-11-01',
    slug: 'data-quality-in-a-distributed-learning-environment'
  },
  {
    dateEnd: '2021-05-01',
    dateStart: '2016-12-12',
    slug: 'deeprank'
  },
  {
    dateEnd: '2020-04-01',
    dateStart: '2015-08-24',
    slug: 'detecting-anomalous-behavior-in-stadium-crowds'
  },
  {
    dateEnd: '2017-04-01',
    dateStart: '2015-12-16',
    slug: 'diagnosis-of-active-epilepsy-in-resource-poor-setting'
  },
  {
    dateEnd: '2016-04-01',
    dateStart: '2014-12-18',
    slug: 'dilipad'
  },
  {
    dateEnd: '2020-04-01',
    dateStart: '2016-12-12',
    slug: 'dirac'
  },
  {
    dateEnd: '2017-06-24',
    dateStart: '2014-12-18',
    slug: 'dive'
  },
  {
    dateEnd: '2015-09-30',
    dateStart: '2013-12-16',
    slug: 'dr-watson'
  },
  {
    dateEnd: '2019-04-01',
    dateStart: '2018-04-01',
    slug: 'dtl-semantic-analysis-of-radiology-reports-utilizing-lexicon'
  },
  {
    dateEnd: '2019-12-31',
    dateStart: '2015-12-07',
    slug: 'dynaslum'
  },
  {
    dateEnd: '2020-12-31',
    dateStart: '2015-12-07',
    slug: 'e-musc'
  },
  {
    dateEnd: '2015-10-04',
    dateStart: '2013-01-21',
    slug: 'e-visualization-of-big-data'
  },
  {
    dateEnd: '2021-07-01',
    dateStart: '2016-12-12',
    slug: 'eecolidar'
  },
  {
    dateEnd: '2016-03-03',
    dateStart: '2012-01-20',
    slug: 'eecology'
  },
  {
    dateEnd: '2021-05-15',
    dateStart: '2016-12-12',
    slug: 'emotion-recognition-in-dementia'
  },
  {
    dateEnd: '2019-04-15',
    dateStart: '2015-04-15',
    slug: 'enabling-dynamic-services'
  },
  {
    dateEnd: '2020-12-31',
    dateStart: '2019-01-01',
    slug: 'enhance-your-research-alliance-eyra-benchmark-platform'
  },
  {
    dateEnd: '2019-03-21',
    dateStart: '2015-12-07',
    slug: 'enhancing-protein-drug-binding-prediction'
  },
  {
    dateEnd: '2018-11-08',
    dateStart: '2018-01-01',
    slug: 'eoscpilot-lofar'
  },
  {
    dateEnd: '2021-05-01',
    dateStart: '2018-12-17',
    slug: 'epodium'
  },
  {
    dateEnd: '2019-12-31',
    dateStart: '2014-12-18',
    slug: 'era-urban'
  },
  {
    dateEnd: '2023-02-28',
    dateStart: '2019-06-06',
    slug: 'eratosthenes'
  },
  {
    dateEnd: '2018-10-01',
    dateStart: '2015-11-16',
    slug: 'error-detection-and-error-localization'
  },
  {
    dateEnd: '2016-02-01',
    dateStart: '2012-01-20',
    slug: 'esalsa'
  },
  {
    dateEnd: '2022-01-01',
    dateStart: '2017-12-18',
    slug: 'escience-technology-to-boost-quantum-dot-energy-conversion'
  },
  {
    dateEnd: '2014-03-06',
    dateStart: '2012-02-15',
    slug: 'esibayes'
  },
  {
    dateEnd: '2022-12-31',
    dateStart: '2019-01-01',
    slug: 'esiwace2-2'
  },
  {
    dateEnd: '2022-05-31',
    dateStart: '2017-12-01',
    slug: 'european-climate-prediction-system'
  },
  {
    dateEnd: '2019-12-31',
    dateStart: '2017-09-01',
    slug: 'evidence'
  },
  {
    dateEnd: '2015-12-31',
    dateStart: '2012-01-20',
    slug: 'ewatercycle'
  },
  {
    dateEnd: '2022-06-01',
    dateStart: '2017-12-18',
    slug: 'ewatercycle-ii'
  },
  {
    dateEnd: '2013-12-01',
    dateStart: '2012-11-01',
    slug: 'extreme-climate-change'
  },
  {
    dateEnd: '2020-12-31',
    dateStart: '2020-04-15',
    slug: 'fair-data-for-capacity'
  },
  {
    dateEnd: '2021-03-31',
    dateStart: '2017-12-18',
    slug: 'fair-is-as-fair-does'
  },
  {
    dateEnd: '2017-04-01',
    dateStart: '2016-02-10',
    slug: 'fast-open-source-simulator-of-low-energy-scattering-of-charged-particles-in-matter'
  },
  {
    dateEnd: '2022-05-31',
    dateStart: '2017-12-18',
    slug: 'fedmix'
  },
  {
    dateEnd: '2015-06-30',
    dateStart: '2015-03-01',
    slug: 'from-sentiment-mining-to-mining-embodied-emotions'
  },
  {
    dateEnd: '2019-04-01',
    dateStart: '2017-04-01',
    slug: 'genetics-of-sleep-patterns'
  },
  {
    dateEnd: '2016-03-31',
    dateStart: '2015-05-01',
    slug: 'giving-pandas-a-root-to-chew-on'
  },
  {
    dateEnd: '2019-08-01',
    dateStart: '2017-08-01',
    slug: 'glammap'
  },
  {
    dateEnd: '2020-12-31',
    dateStart: '2016-12-12',
    slug: 'googling-the-cancer-genome'
  },
  {
    dateEnd: '2016-05-31',
    dateStart: '2013-12-16',
    slug: 'hadrianvs'
  },
  {
    dateEnd: '2018-07-31',
    dateStart: '2016-12-19',
    slug: 'high-spatial-resolution-phenological-modelling-at-continental-scales'
  },
  {
    dateEnd: '2020-08-31',
    dateStart: '2015-12-07',
    slug: 'idark'
  },
  {
    dateEnd: '2018-06-19',
    dateStart: '2016-12-19',
    slug: 'impact'
  },
  {
    dateEnd: '2016-11-01',
    dateStart: '2015-07-13',
    slug: 'improving-open-source-photogrammetric-workflows-for-processing-big-datasets'
  },
  {
    dateEnd: '2022-01-01',
    dateStart: '2017-12-18',
    slug: 'inside-the-filter-bubble'
  },
  {
    dateEnd: '2022-07-01',
    dateStart: '2017-12-18',
    slug: 'integrated-omics-analysis-for-small-molecule-mediated-host-microbiome-interactions'
  },
  {
    dateEnd: '2023-02-28',
    dateStart: '2019-01-01',
    slug: 'is-enes3'
  },
  {
    dateEnd: '2017-11-30',
    dateStart: '2014-12-18',
    slug: 'large-scale-data-assimilation'
  },
  {
    dateEnd: '2019-03-31',
    dateStart: '2016-10-01',
    slug: 'magic'
  },
  {
    dateEnd: '2015-08-24',
    dateStart: '2013-09-16',
    slug: 'mapping-the-via-appia-in-3d'
  },
  {
    dateEnd: '2015-12-31',
    dateStart: '2015-05-01',
    slug: 'massive-biological-data-clustering-reporting-and-visualization-tools'
  },
  {
    dateEnd: '2015-12-07',
    dateStart: '2012-12-20',
    slug: 'massive-point-clouds-for-esciences'
  },
  {
    dateEnd: '2017-08-01',
    dateStart: '2015-05-01',
    slug: 'mining-shifting-concepts-through-time-shico'
  },
  {
    dateEnd: '2021-07-01',
    dateStart: '2018-12-17',
    slug: 'monitoring-tropical-forest-recovery-capacity-using-radar-sentinel-satellite-data'
  },
  {
    dateEnd: '2022-07-01',
    dateStart: '2018-12-17',
    slug: 'mosaic'
  },
  {
    dateEnd: '2025-04-01',
    dateStart: '2019-12-08',
    slug: 'mydigitwin'
  },
  {
    dateEnd: '2020-12-31',
    dateStart: '2017-09-01',
    slug: 'newsgac'
  },
  {
    dateEnd: '2014-03-17',
    dateStart: '2012-11-19',
    slug: 'odex4all'
  },
  {
    dateEnd: '2022-04-01',
    dateStart: '2017-12-18',
    slug: 'parallel-in-time-methods-for-the-propagation-of-uncertainties-in-wind-farm-simulations'
  },
  {
    dateEnd: '2018-06-30',
    dateStart: '2016-10-05',
    slug: 'parallelisation-of-multi-point-cloud-registration'
  },
  {
    dateEnd: '2022-01-31',
    dateStart: '2017-12-18',
    slug: 'passing-xsams'
  },
  {
    dateEnd: '2025-03-01',
    dateStart: '2019-12-18',
    slug: 'perfect-fit'
  },
  {
    dateEnd: '2018-07-14',
    dateStart: '2013-12-16',
    slug: 'pidimehs'
  },
  {
    dateEnd: '2019-12-31',
    dateStart: '2015-11-01',
    slug: 'primavera'
  },
  {
    dateEnd: '2020-11-01',
    dateStart: '2017-12-01',
    slug: 'process-2'
  },
  {
    dateEnd: '2020-10-31',
    dateStart: '2020-04-15',
    slug: 'puregome'
  },
  {
    dateEnd: '2017-03-31',
    dateStart: '2015-07-13',
    slug: 'real-time-detection-of-neutrinos-from-the-distant-universe'
  },
  {
    dateEnd: '2023-05-31',
    dateStart: '2019-06-01',
    slug: 'receipt'
  },
  {
    dateEnd: '2023-11-30',
    dateStart: '2019-06-06',
    slug: 'remote-sensing-of-damage-feedbacks-and-ice-shelf-instability-in-antarctica'
  },
  {
    dateEnd: '2021-04-15',
    dateStart: '2020-04-15',
    slug: 'retina-covid19'
  },
  {
    dateEnd: '2016-01-18',
    dateStart: '2014-12-18',
    slug: 'rt-sar'
  },
  {
    dateEnd: '2021-12-31',
    dateStart: '2017-12-18',
    slug: 'scalable-high-fidelity-simulations-of-reacting-multiphase-flows-at-transcritical-pressure'
  },
  {
    dateEnd: '2022-12-31',
    dateStart: '2019-12-18',
    slug: 'scaling-up-pan-genomics-for-plant-breeding'
  },
  {
    dateEnd: '2021-12-31',
    dateStart: '2017-12-18',
    slug: 'secconnet'
  },
  {
    dateEnd: '2017-12-31',
    dateStart: '2013-03-01',
    slug: 'sim-city'
  },
  {
    dateEnd: '2017-06-30',
    dateStart: '2013-01-21',
    slug: 'spudisc'
  },
  {
    dateEnd: '2021-12-31',
    dateStart: '2017-12-18',
    slug: 'stochastic-multiscale-climate-models'
  },
  {
    dateEnd: '2023-03-01',
    dateStart: '2019-12-18',
    slug: 'strap'
  },
  {
    dateEnd: '2016-09-01',
    dateStart: '2013-01-21',
    slug: 'summer-in-the-city'
  },
  {
    dateEnd: '2020-10-01',
    dateStart: '2018-11-20',
    slug: 'tadpole-share'
  },
  {
    dateEnd: '2015-03-20',
    dateStart: '2013-12-04',
    slug: 'texcavator'
  },
  {
    dateEnd: '2023-07-01',
    dateStart: '2020-07-01',
    slug: 'the-petaflop-aartfaac-data-reduction-engine-padre'
  },
  {
    dateEnd: '2020-12-31',
    dateStart: '2017-09-01',
    slug: 'ticclat'
  },
  {
    dateEnd: '2017-03-31',
    dateStart: '2015-12-16',
    slug: 'towards-a-species-by-species-approach-to-global-biodiversity-modelling'
  },
  {
    dateEnd: '2019-10-01',
    dateStart: '2015-12-07',
    slug: 'towards-large-scale-cloud-resolving-climate-simulations'
  },
  {
    dateEnd: '2015-12-31',
    dateStart: '2012-01-20',
    slug: 'trait'
  },
  {
    dateEnd: '2021-03-01',
    dateStart: '2016-12-12',
    slug: 'triple-a-2'
  },
  {
    dateEnd: '2019-12-31',
    dateStart: '2016-07-01',
    slug: 'twex'
  },
  {
    dateEnd: '2014-03-06',
    dateStart: '2012-08-13',
    slug: 'twinl'
  },
  {
    dateEnd: '2021-07-01',
    dateStart: '2018-12-17',
    slug: 'understanding-visually-grounded-spoken-language-via-multi-tasking'
  },
  {
    dateEnd: '2021-06-11',
    dateStart: '2016-12-12',
    slug: 'visual-storytelling-of-big-imaging-data'
  },
  {
    dateEnd: '2017-07-01',
    dateStart: '2016-07-11',
    slug: 'visualizing-uncertainty-and-perspectives'
  },
  {
    dateEnd: '2020-12-31',
    dateStart: '2015-12-07',
    slug: 'what-works-when-for-whom'
  }
]

data.forEach((d) => {
  const query = {
    slug: d.slug
  }
  const update = {
    $set: {
      dateEnd: d.dateEnd,
      dateStart: d.dateStart
    }
  }

  print('Updating project start and end dates for ' + d.slug)
  db.project.update(query, update)
})
