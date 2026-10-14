---
title: "How BIO-DGI reads multiple myeloma as a network"
date: 2025-06-20
type: paper
summary: "Why we treated genes as a graph to find what drives MGUS to become multiple myeloma, and how that led to a 295-gene panel."
tags: ["Multiple myeloma", "Graph learning", "Explainable AI"]
paper: 2025-06-16-a-comprehensive-targeted-panel-of-295-genes-in-m
---

Multiple myeloma (MM) almost always begins as a quiet precursor called MGUS, monoclonal gammopathy of undetermined significance. Most people with MGUS never progress. Some do. The question behind BIO-DGI is which genetic changes mark that transition.

## Why a network

Looking at genes one at a time misses how they act together. A mutation in one gene can matter because of what it touches. So BIO-DGI starts from gene-gene interaction networks and lets the model learn which connections carry signal.

## What goes in

BIO-DGI is a bio-inspired graph learning model. It integrates three kinds of genomic alteration:

- **SNVs**, single-nucleotide variants
- **CNVs**, copy-number variants
- **SVs**, structural variants

An attention mechanism weighs each gene's neighbours, so the model can say which genes and interactions most separate MM from MGUS.

## What came out

The result is a targeted panel of 295 genes covering disease-initiating and transformative biomarkers in multiple myeloma.

> The aim was never only to classify patients. It was to get a short list of genes someone can take back to the lab.

*This post is a starter written from the paper's abstract. Rewrite it in your own voice.*
