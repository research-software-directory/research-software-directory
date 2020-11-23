/* global db */

<<<<<<< HEAD
const data = [
 {
  "dateEnd": "30-04-2018",
  "dateStart": "18-12-2014",
  "slug": "3d-e-chem"
 },
 {
  "dateEnd": "31-03-2018",
  "dateStart": "01-11-2016",
  "slug": "3d-printing-of-human-body-parts"
 },
 {
  "dateEnd": "30-06-2017",
  "dateStart": "18-12-2013",
  "slug": "a-jungle-computing-approach-to-large-scale-online-forensic-analysis"
 },
 {
  "dateEnd": "01-03-2022",
  "dateStart": "18-12-2017",
  "slug": "a-light-in-the-dark"
 },
 {
  "dateEnd": "01-02-2021",
  "dateStart": "12-12-2016",
  "slug": "a-methodology-and-ecosystem-for-many-core-programming"
 },
 {
  "dateEnd": "31-12-2022",
  "dateStart": "06-06-2019",
  "slug": "a-new-perspective-on-global-vegetation-water-dynamics-from-radar-satellite-data"
 },
 {
  "dateEnd": "31-12-2021",
  "dateStart": "18-12-2017",
  "slug": "a-phase-field-model-to-guide-the-development-and-design-of-next-generation-solid-state-batteries"
 },
 {
  "dateEnd": "31-08-2021",
  "dateStart": "07-12-2015",
  "slug": "aa-alert"
 },
 {
  "dateEnd": "31-03-2017",
  "dateStart": "18-12-2013",
  "slug": "abc-muse"
 },
 {
  "dateEnd": "31-05-2021",
  "dateStart": "07-12-2015",
  "slug": "algorithmic-geo-visualization"
 },
 {
  "dateEnd": "24-04-2015",
  "dateStart": "10-09-2012",
  "slug": "amuse"
 },
 {
  "dateEnd": "31-12-2016",
  "dateStart": "01-06-2015",
  "slug": "andi"
 },
 {
  "dateEnd": "01-03-2019",
  "dateStart": "19-12-2016",
  "slug": "autograph"
 },
 {
  "dateEnd": "20-06-2018",
  "dateStart": "20-12-2016",
  "slug": "automated-analysis-of-online-behaviour-on-social-media"
 },
 {
  "dateEnd": "31-12-2020",
  "dateStart": "07-12-2015",
  "slug": "automated-parallel-calculation-of-collaborative-statistical-models"
 },
 {
  "dateEnd": "10-09-2015",
  "dateStart": "16-12-2013",
  "slug": "beyond-the-book"
 },
 {
  "dateEnd": "23-06-2015",
  "dateStart": "18-12-2013",
  "slug": "big-data-analytics-in-the-geo-spatial-domain"
 },
 {
  "dateEnd": "01-10-2016",
  "dateStart": "31-05-2012",
  "slug": "biographynet"
 },
 {
  "dateEnd": "30-11-2015",
  "dateStart": "20-01-2012",
  "slug": "biomarker-boosting"
 },
 {
  "dateEnd": "01-06-2017",
  "dateStart": "01-06-2016",
  "slug": "birdradar"
 },
 {
  "dateEnd": "28-02-2021",
  "dateStart": "01-12-2016",
  "slug": "blue-action"
 },
 {
  "dateEnd": "31-12-2019",
  "dateStart": "01-09-2017",
  "slug": "bridging-the-gap"
 },
 {
  "dateEnd": "03-09-2019",
  "dateStart": "18-12-2014",
  "slug": "candygene"
 },
 {
  "dateEnd": "01-03-2025",
  "dateStart": "18-12-2019",
  "slug": "carrier"
 },
 {
  "dateEnd": "30-09-2017",
  "dateStart": "01-10-2016",
  "slug": "case-law-analytics"
 },
 {
  "dateEnd": "07-09-2015",
  "dateStart": "18-04-2014",
  "slug": "chemical-analytics-platform"
 },
 {
  "dateEnd": "19-05-2015",
  "dateStart": "20-01-2012",
  "slug": "chemical-informatics-for-metabolite-identification-and-biochemical-network-reconstruction"
 },
 {
  "dateEnd": "16-05-2023",
  "dateStart": "16-05-2019",
  "slug": "cheops"
 },
 {
  "dateEnd": "20-06-2018",
  "dateStart": "19-12-2016",
  "slug": "city-cloud"
 },
 {
  "dateEnd": "01-12-2016",
  "dateStart": "04-04-2016",
  "slug": "classifying-activity-types"
 },
 {
  "dateEnd": "31-12-2015",
  "dateStart": "01-05-2015",
  "slug": "compressing-the-sky-into-a-large-collection-of-statistical-models"
 },
 {
  "dateEnd": "30-06-2022",
  "dateStart": "18-12-2017",
  "slug": "computation-of-the-optical-properties-of-nano-structures"
 },
 {
  "dateEnd": "01-12-2017",
  "dateStart": "18-12-2014",
  "slug": "computational-chemistry-made-easy"
 },
 {
  "dateEnd": "31-12-2020",
  "dateStart": "01-12-2019",
  "slug": "copernicus-attribution"
 },
 {
  "dateEnd": "01-12-2021",
  "dateStart": "01-12-2019",
  "slug": "cortex"
 },
 {
  "dateEnd": "31-12-2020",
  "dateStart": "15-04-2020",
  "slug": "covid-19-grand-challenge"
 },
 {
  "dateEnd": "01-10-2015",
  "dateStart": "20-01-2012",
  "slug": "creation-of-food-specific-ontologies-for-food-focused-text-mining"
 },
 {
  "dateEnd": "01-07-2022",
  "dateStart": "18-12-2019",
  "slug": "darkgenerators"
 },
 {
  "dateEnd": "20-06-2018",
  "dateStart": "20-12-2016",
  "slug": "data-mining-tools-for-abrupt-climate-change"
 },
 {
  "dateEnd": "31-07-2018",
  "dateStart": "01-11-2016",
  "slug": "data-quality-in-a-distributed-learning-environment"
 },
 {
  "dateEnd": "01-05-2021",
  "dateStart": "12-12-2016",
  "slug": "deeprank"
 },
 {
  "dateEnd": "01-04-2020",
  "dateStart": "24-08-2015",
  "slug": "detecting-anomalous-behavior-in-stadium-crowds"
 },
 {
  "dateEnd": "01-04-2017",
  "dateStart": "16-12-2015",
  "slug": "diagnosis-of-active-epilepsy-in-resource-poor-setting"
 },
 {
  "dateEnd": "01-04-2016",
  "dateStart": "18-12-2014",
  "slug": "dilipad"
 },
 {
  "dateEnd": "01-04-2020",
  "dateStart": "12-12-2016",
  "slug": "dirac"
 },
 {
  "dateEnd": "24-06-2017",
  "dateStart": "18-12-2014",
  "slug": "dive"
 },
 {
  "dateEnd": "30-09-2015",
  "dateStart": "16-12-2013",
  "slug": "dr-watson"
 },
 {
  "dateEnd": "01-04-2019",
  "dateStart": "01-04-2018",
  "slug": "dtl-semantic-analysis-of-radiology-reports-utilizing-lexicon"
 },
 {
  "dateEnd": "31-12-2019",
  "dateStart": "07-12-2015",
  "slug": "dynaslum"
 },
 {
  "dateEnd": "31-12-2020",
  "dateStart": "07-12-2015",
  "slug": "e-musc"
 },
 {
  "dateEnd": "04-10-2015",
  "dateStart": "21-01-2013",
  "slug": "e-visualization-of-big-data"
 },
 {
  "dateEnd": "01-07-2021",
  "dateStart": "12-12-2016",
  "slug": "eecolidar"
 },
 {
  "dateEnd": "03-03-2016",
  "dateStart": "20-01-2012",
  "slug": "eecology"
 },
 {
  "dateEnd": "15-05-2021",
  "dateStart": "12-12-2016",
  "slug": "emotion-recognition-in-dementia"
 },
 {
  "dateEnd": "15-04-2019",
  "dateStart": "15-04-2015",
  "slug": "enabling-dynamic-services"
 },
 {
  "dateEnd": "31-12-2020",
  "dateStart": "01-01-2019",
  "slug": "enhance-your-research-alliance-eyra-benchmark-platform"
 },
 {
  "dateEnd": "21-03-2019",
  "dateStart": "07-12-2015",
  "slug": "enhancing-protein-drug-binding-prediction"
 },
 {
  "dateEnd": "08-11-2018",
  "dateStart": "01-01-2018",
  "slug": "eoscpilot-lofar"
 },
 {
  "dateEnd": "01-05-2021",
  "dateStart": "17-12-2018",
  "slug": "epodium"
 },
 {
  "dateEnd": "31-12-2019",
  "dateStart": "18-12-2014",
  "slug": "era-urban"
 },
 {
  "dateEnd": "28-02-2023",
  "dateStart": "06-06-2019",
  "slug": "eratosthenes"
 },
 {
  "dateEnd": "01-10-2018",
  "dateStart": "16-11-2015",
  "slug": "error-detection-and-error-localization"
 },
 {
  "dateEnd": "01-02-2016",
  "dateStart": "20-01-2012",
  "slug": "esalsa"
 },
 {
  "dateEnd": "01-01-2022",
  "dateStart": "18-12-2017",
  "slug": "escience-technology-to-boost-quantum-dot-energy-conversion"
 },
 {
  "dateEnd": "06-03-2014",
  "dateStart": "15-02-2012",
  "slug": "esibayes"
 },
 {
  "dateEnd": "31-12-2022",
  "dateStart": "01-01-2019",
  "slug": "esiwace2-2"
 },
 {
  "dateEnd": "31-05-2022",
  "dateStart": "01-12-2017",
  "slug": "european-climate-prediction-system"
 },
 {
  "dateEnd": "31-12-2019",
  "dateStart": "01-09-2017",
  "slug": "evidence"
 },
 {
  "dateEnd": "31-12-2015",
  "dateStart": "20-01-2012",
  "slug": "ewatercycle"
 },
 {
  "dateEnd": "01-06-2022",
  "dateStart": "18-12-2017",
  "slug": "ewatercycle-ii"
 },
 {
  "dateEnd": "01-12-2013",
  "dateStart": "01-11-2012",
  "slug": "extreme-climate-change"
 },
 {
  "dateEnd": "31-12-2020",
  "dateStart": "15-04-2020",
  "slug": "fair-data-for-capacity"
 },
 {
  "dateEnd": "31-03-2021",
  "dateStart": "18-12-2017",
  "slug": "fair-is-as-fair-does"
 },
 {
  "dateEnd": "01-04-2017",
  "dateStart": "10-02-2016",
  "slug": "fast-open-source-simulator-of-low-energy-scattering-of-charged-particles-in-matter"
 },
 {
  "dateEnd": "31-05-2022",
  "dateStart": "18-12-2017",
  "slug": "fedmix"
 },
 {
  "dateEnd": "30-06-2015",
  "dateStart": "01-03-2015",
  "slug": "from-sentiment-mining-to-mining-embodied-emotions"
 },
 {
  "dateEnd": "01-04-2019",
  "dateStart": "01-04-2017",
  "slug": "genetics-of-sleep-patterns"
 },
 {
  "dateEnd": "31-03-2016",
  "dateStart": "01-05-2015",
  "slug": "giving-pandas-a-root-to-chew-on"
 },
 {
  "dateEnd": "01-08-2019",
  "dateStart": "01-08-2017",
  "slug": "glammap"
 },
 {
  "dateEnd": "31-12-2020",
  "dateStart": "12-12-2016",
  "slug": "googling-the-cancer-genome"
 },
 {
  "dateEnd": "31-05-2016",
  "dateStart": "16-12-2013",
  "slug": "hadrianvs"
 },
 {
  "dateEnd": "31-07-2018",
  "dateStart": "19-12-2016",
  "slug": "high-spatial-resolution-phenological-modelling-at-continental-scales"
 },
 {
  "dateEnd": "31-08-2020",
  "dateStart": "07-12-2015",
  "slug": "idark"
 },
 {
  "dateEnd": "19-06-2018",
  "dateStart": "19-12-2016",
  "slug": "impact"
 },
 {
  "dateEnd": "01-11-2016",
  "dateStart": "13-07-2015",
  "slug": "improving-open-source-photogrammetric-workflows-for-processing-big-datasets"
 },
 {
  "dateEnd": "01-01-2022",
  "dateStart": "18-12-2017",
  "slug": "inside-the-filter-bubble"
 },
 {
  "dateEnd": "01-07-2022",
  "dateStart": "18-12-2017",
  "slug": "integrated-omics-analysis-for-small-molecule-mediated-host-microbiome-interactions"
 },
 {
  "dateEnd": "28-02-2023",
  "dateStart": "01-01-2019",
  "slug": "is-enes3"
 },
 {
  "dateEnd": "30-11-2017",
  "dateStart": "18-12-2014",
  "slug": "large-scale-data-assimilation"
 },
 {
  "dateEnd": "31-03-2019",
  "dateStart": "01-10-2016",
  "slug": "magic"
 },
 {
  "dateEnd": "24-08-2015",
  "dateStart": "16-09-2013",
  "slug": "mapping-the-via-appia-in-3d"
 },
 {
  "dateEnd": "31-12-2015",
  "dateStart": "01-05-2015",
  "slug": "massive-biological-data-clustering-reporting-and-visualization-tools"
 },
 {
  "dateEnd": "07-12-2015",
  "dateStart": "20-12-2012",
  "slug": "massive-point-clouds-for-esciences"
 },
 {
  "dateEnd": "01-08-2017",
  "dateStart": "01-05-2015",
  "slug": "mining-shifting-concepts-through-time-shico"
 },
 {
  "dateEnd": "01-07-2021",
  "dateStart": "17-12-2018",
  "slug": "monitoring-tropical-forest-recovery-capacity-using-radar-sentinel-satellite-data"
 },
 {
  "dateEnd": "01-07-2022",
  "dateStart": "17-12-2018",
  "slug": "mosaic"
 },
 {
  "dateEnd": "01-04-2025",
  "dateStart": "08-12-2019",
  "slug": "mydigitwin"
 },
 {
  "dateEnd": "31-12-2020",
  "dateStart": "01-09-2017",
  "slug": "newsgac"
 },
 {
  "dateEnd": "17-03-2014",
  "dateStart": "19-11-2012",
  "slug": "odex4all"
 },
 {
  "dateEnd": "01-04-2022",
  "dateStart": "18-12-2017",
  "slug": "parallel-in-time-methods-for-the-propagation-of-uncertainties-in-wind-farm-simulations"
 },
 {
  "dateEnd": "30-06-2018",
  "dateStart": "05-10-2016",
  "slug": "parallelisation-of-multi-point-cloud-registration"
 },
 {
  "dateEnd": "31-01-2022",
  "dateStart": "18-12-2017",
  "slug": "passing-xsams"
 },
 {
  "dateEnd": "01-03-2025",
  "dateStart": "18-12-2019",
  "slug": "perfect-fit"
 },
 {
  "dateEnd": "14-07-2018",
  "dateStart": "16-12-2013",
  "slug": "pidimehs"
 },
 {
  "dateEnd": "31-12-2019",
  "dateStart": "01-11-2015",
  "slug": "primavera"
 },
 {
  "dateEnd": "01-11-2020",
  "dateStart": "01-12-2017",
  "slug": "process-2"
 },
 {
  "dateEnd": "31-10-2020",
  "dateStart": "15-04-2020",
  "slug": "puregome"
 },
 {
  "dateEnd": "31-03-2017",
  "dateStart": "13-07-2015",
  "slug": "real-time-detection-of-neutrinos-from-the-distant-universe"
 },
 {
  "dateEnd": "31-05-2023",
  "dateStart": "01-06-2019",
  "slug": "receipt"
 },
 {
  "dateEnd": "30-11-2023",
  "dateStart": "06-06-2019",
  "slug": "remote-sensing-of-damage-feedbacks-and-ice-shelf-instability-in-antarctica"
 },
 {
  "dateEnd": "15-04-2021",
  "dateStart": "15-04-2020",
  "slug": "retina-covid19"
 },
 {
  "dateEnd": "18-01-2016",
  "dateStart": "18-12-2014",
  "slug": "rt-sar"
 },
 {
  "dateEnd": "31-12-2021",
  "dateStart": "18-12-2017",
  "slug": "scalable-high-fidelity-simulations-of-reacting-multiphase-flows-at-transcritical-pressure"
 },
 {
  "dateEnd": "31-12-2022",
  "dateStart": "18-12-2019",
  "slug": "scaling-up-pan-genomics-for-plant-breeding"
 },
 {
  "dateEnd": "31-12-2021",
  "dateStart": "18-12-2017",
  "slug": "secconnet"
 },
 {
  "dateEnd": "31-12-2017",
  "dateStart": "01-03-2013",
  "slug": "sim-city"
 },
 {
  "dateEnd": "30-06-2017",
  "dateStart": "21-01-2013",
  "slug": "spudisc"
 },
 {
  "dateEnd": "31-12-2021",
  "dateStart": "18-12-2017",
  "slug": "stochastic-multiscale-climate-models"
 },
 {
  "dateEnd": "01-03-2023",
  "dateStart": "18-12-2019",
  "slug": "strap"
 },
 {
  "dateEnd": "01-09-2016",
  "dateStart": "21-01-2013",
  "slug": "summer-in-the-city"
 },
 {
  "dateEnd": "01-10-2020",
  "dateStart": "20-11-2018",
  "slug": "tadpole-share"
 },
 {
  "dateEnd": "20-03-2015",
  "dateStart": "04-12-2013",
  "slug": "texcavator"
 },
 {
  "dateEnd": "01-07-2023",
  "dateStart": "01-07-2020",
  "slug": "the-petaflop-aartfaac-data-reduction-engine-padre"
 },
 {
  "dateEnd": "31-12-2020",
  "dateStart": "01-09-2017",
  "slug": "ticclat"
 },
 {
  "dateEnd": "31-03-2017",
  "dateStart": "16-12-2015",
  "slug": "towards-a-species-by-species-approach-to-global-biodiversity-modelling"
 },
 {
  "dateEnd": "01-10-2019",
  "dateStart": "07-12-2015",
  "slug": "towards-large-scale-cloud-resolving-climate-simulations"
 },
 {
  "dateEnd": "31-12-2015",
  "dateStart": "20-01-2012",
  "slug": "trait"
 },
 {
  "dateEnd": "01-03-2021",
  "dateStart": "12-12-2016",
  "slug": "triple-a-2"
 },
 {
  "dateEnd": "31-12-2019",
  "dateStart": "01-07-2016",
  "slug": "twex"
 },
 {
  "dateEnd": "06-03-2014",
  "dateStart": "13-08-2012",
  "slug": "twinl"
 },
 {
  "dateEnd": "01-07-2021",
  "dateStart": "17-12-2018",
  "slug": "understanding-visually-grounded-spoken-language-via-multi-tasking"
 },
 {
  "dateEnd": "11-06-2021",
  "dateStart": "12-12-2016",
  "slug": "visual-storytelling-of-big-imaging-data"
 },
 {
  "dateEnd": "01-07-2017",
  "dateStart": "11-07-2016",
  "slug": "visualizing-uncertainty-and-perspectives"
 },
 {
  "dateEnd": "31-12-2020",
  "dateStart": "07-12-2015",
  "slug": "what-works-when-for-whom"
 }
]
=======
const data = [{
  dateEnd: '2021-08-19',
  dateStart: '2018-08-19',
  slug: 'abc-muse'
}]
>>>>>>> master

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

  db.project.update(query, update)
})
