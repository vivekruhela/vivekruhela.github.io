---
title: "A Unified Computational Framework for a Robust, Reliable, and Reproducible Identification of Novel miRNAs From the RNA Sequencing Data"
collection: publications
category: manuscripts
excerpt: "Meet miRPipe — our end-to-end framework that accurately detects and quantifies known and novel miRNAs and piRNAs from small-RNA sequencing data. By combining seed-based clustering and novel sequence analysis, miRPipe outperforms existing tools, revealing more cancer-linked small RNAs across CLL, lung, and breast cancer datasets."
permalink: /publication/mirpipe_rnaseq
date: 2022-07-22
venue: 'Frontiers in Bioinformatics'
slidesurl: 'http://vivekruhela.github.io/files/mirpipe_rnaseq_slides.pdf'
paperurl: 'http://vivekruhela.github.io/files/mirpipe_rnaseq.pdf'
bibtexurl: 'http://vivekruhela.github.io/files/mirpipe_rnaseq.bib'
citation: 'Ruhela, V., Gupta, A., Sriram, K., Ahuja, G., Kaur, G. and Gupta, R., 2022. A Unified Computational Framework for a Robust, Reliable, and Reproducible 
Identification of Novel miRNAs From the RNA Sequencing Data. <i>Frontiers in Bioinformatics</i>, 2, p.842051.'
---
In eukaryotic cells, miRNAs regulate a plethora of cellular functionalities ranging from cellular metabolisms, and development to the regulation of biological networks and pathways, both under homeostatic and pathological states like cancer.Despite their immense importance as key regulators of cellular processes, accurate and reliable estimation of miRNAs using Next Generation Sequencing is challenging, largely due to the limited availability of robust computational tools/methods/pipelines. Here, we introduce miRPipe, an end-to-end computational framework for the identification, characterization, and expression estimation of small RNAs, including the known and novel miRNAs and previously annotated pi-RNAs from small-RNA sequencing profiles. Our workflow detects
unique novel miRNAs by incorporating the sequence information of seed and non-seed regions, concomitant with clustering analysis. This approach allows reliable and
reproducible detection of unique novel miRNAs and functionally same miRNAs (paralogues). We validated the performance of miRPipe with the available state-of-theart
pipelines using both synthetic datasets generated using the newly developed miRSim tool and three cancer datasets (Chronic Lymphocytic Leukemia, Lung cancer, and breast cancer). In the experiment over the synthetic dataset, miRPipe is observed to outperform the existing state-of-the-art pipelines (accuracy: 95.23% and F1-score: 94.17%). Analysis on all the three cancer datasets shows that miRPipe is able to extract more number of known dysregulated miRNAs or piRNAs from the datasets as compared to the existing pipelines.
