---
title: "miRSim: Seed-based Synthetic Small Non-coding RNA Sequence Simulator"
collection: publications
category: softwares
permalink: /publication/2021-06-14-mirsim_rnaseq
excerpt: '**miRSim** — the first synthetic small RNA simulator that creates realistic miRNA and piRNA reads with known ground truth, enabling precise benchmarking of RNA-seq analysis tools.'
date: 2021-06-14
venue: 'Genetics and Genomics (Zenodo)'
slidesurl: 'http://vivekruhela.github.io/files/mirsim_rnaseq_slides.pdf'
paperurl: 'http://vivekruhela.github.io/files/mirsim_rnaseq.pdf'
bibtexurl: 'http://vivekruhela.github.io/files/mirsim_rnaseq.bib'
citation: 'Vivek Ruhela (2021) “miRSim: Seed-based Synthetic Small Non-coding RNA Sequence Simulator”. <i>Zenodo</i>. doi:10.5281/zenodo.6546356.'
---
Micro RNAs (miRNA) regulate a number of cellular functions and are centrally classified in the networks of oncogenes and tumor suppressor genes. To extract the microRNAs from sequencing data, it’s important to use a robust, stable and flexible pipeline that provides results with high accuracy and precision. However, due to the unavailability of a synthetic sequence simulator with known ground truth, it is difficult to assess the performance of existing bioinformatics pipelines in identifying dysregulated miRNAs from RNA-seq data. Here, we present miRSim tool that generates synthetic sequence reads of miRNAs, piRNAs, and altered sequences of miRNAs in the form of a FASTQ file. miRSim provides the functionality for the performance assessment of bioinformatics tools on the accurate identification of miRNAs, functionally similar miRNAs (paralogues), miRNAs belonging to the same phylogenetic trees, and piRNAs. miRSim also generates synthetic sequences of miRNAs altered in the seed and xseed (region other than the seed region of an miRNA sequence) regions of the known miRNA and piRNA sequences to allow researchers test the efficacy of the pipelines in rejecting altered reads.


