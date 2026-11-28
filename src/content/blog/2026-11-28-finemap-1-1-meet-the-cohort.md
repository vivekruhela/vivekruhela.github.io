---
title: "Statistical fine-mapping, post 1.1: meet the cohort, one person in four files"
date: 2026-11-28
type: method
summary: "What the files of a genetic study look like, how one person is spread across genotypes, expression, clinical data and methylation, and how to check that the pieces really belong together: IDs, sex and identity checks, genome builds and alleles."
tags: ["fine-mapping", "data formats", "VCF", "PLINK", "sample QC", "statistical genetics", "tutorial"]
draft: false
---

[![Code](https://img.shields.io/badge/code-GitHub-181717?logo=github)](https://github.com/vivekruhela/statistical-genetics/tree/main/posts/1.1-meet-the-cohort)
[![Languages](https://img.shields.io/badge/code-R%20%2B%20Python-2f6f9f)](https://github.com/vivekruhela/statistical-genetics)
[![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/vivekruhela/statistical-genetics/blob/main/LICENSE)

## Contents

- [A patient in four departments](#a-patient-in-four-departments)
- [Four files, four shapes](#four-files-four-shapes)
- [Meet one person](#meet-one-person)
- [The thread that ties them: IDs](#the-thread-that-ties-them-ids)
- [Trust the labels, but check them](#trust-the-labels-but-check-them)
- [Same address, same letter: builds and alleles](#same-address-same-letter-builds-and-alleles)
- [A short checklist](#a-short-checklist)
- [Try it yourself](#try-it-yourself)
- [Concepts in this post](#concepts-in-this-post)
- [References](#references)

## A patient in four departments

Think of a big hospital. You give blood, you have a scan, a nurse weighs you, and somewhere a lab
runs a test nobody explained to you. Each department keeps its own records, in its own way. The
lab has one long sheet per test, with a line for every patient. Radiology has a folder per scan.
The clinic has one page per patient. And each of them writes your name a little differently: one
uses your hospital number, one the barcode on your blood tube, one your initials and date of
birth.

Nobody in the hospital ever sees "you" in one place. To answer a simple question, say, whether
people with a certain blood result tend to be heavier, someone has to pull your line from the lab
sheet and your page from the clinic and be *sure* they are the same person. If two tubes were
swapped on the bench, the answer is quietly wrong, and nothing in the numbers will warn you.

A genetic study is that hospital. In this post we'll open each department's files, line one
person up across all of them, and learn the few checks that tell you the lining up worked. It is
the least glamorous post of the series, and it decides whether every later post can be trusted.

## Four files, four shapes

Our playground from [post 0](/blog/2026-11-04-finemap-00-series-map-and-setup/) has four kinds of
data on the same 443 people. Each comes as its own file, and each file has its own shape:

<iframe src="/finemap/1.1/four-files.html" title="The shape of the genotype, expression, methylation and clinical files, with one person highlighted in each" width="100%" height="470" style="border:0;" loading="lazy"></iframe>

The first three are *wide*: one row per thing measured (a variant, a gene, a CpG site) and one
column per person. The clinical file is the other way round: one row per person, one column per
measurement. Neither is wrong, but it means "the person" is a column in one file and a row in
another, and a careless join can quietly line up the wrong things.

Here is what the files of our cohort actually hold:

| Data | File | One row is | Rows | People |
|---|---|---|---|---|
| Genotypes | `genotypes/genome/cohort.pgen` (+ `.pvar`, `.psam`) | a variant | 11,474,202 | 443 |
| Genotypes at one locus | `genotypes/loci/L01.vcf.gz` | a variant | 7,237 | 443 |
| Expression, as downloaded | `geuvadis/GD660.GeneQuantCount.txt.gz` | a gene | 53,934 | 462, in 660 libraries |
| Expression counts | `expression/counts.tsv.gz` | a gene | 47,175 | 443 |
| Expression, normalised | `expression/expression_int.tsv.gz` | a gene | 14,257 | 443 |
| Methylation | `methylation/methylation_m.tsv.gz` | a CpG site | 480 | 443 |
| Clinical | `clinical/clinical.tsv` | a person | 443 | 443 |
| GWAS summary statistics, ten loci | `gwas/EUR/trait_q.sumstats.tsv.gz` | a variant | 64,039 | none |

Two things jump out. The files are wildly different sizes: millions of variants, tens of thousands
of genes, a few hundred CpGs, and a handful of clinical columns. And the last file has no people
in it at all. GWAS summary statistics are one line per variant with an effect, a standard error
and a p-value: the people were averaged away before the file was shared. That is why so much of
fine-mapping has to borrow information about the people from somewhere else, the theme of
[post R](/blog/2026-11-18-finemap-r-reference-panels/).

What the values *mean* differs too. A genotype is a count, 0, 1 or 2 copies of one allele.
Expression starts as read counts and is then normalised (post 3.1 is all about that). Methylation
is a fraction of DNA copies that carry a methyl mark at that site, the **beta value** between 0
and 1, or its log-ratio, the **M-value**. Clinical columns are whatever the clinic measured, in
whatever units it used.

## Meet one person

Now let's join them. Pick anyone from the menu. Each panel comes from a different file, and the
orange dot is the same person in all four.

<iframe src="/finemap/1.1/one-person.html" title="One person across the genotype, expression, ancestry, clinical and methylation files" width="100%" height="790" style="border:0;" loading="lazy"></iframe>

Top left is the most interesting panel, because it needs *two* files. The gene is *ERAP2*, at our
locus L01, and its activity depends enormously on one common variant nearby: people with two
copies of the A allele express it far more than people with two copies of the G allele, and
people with one of each sit in between. To
draw that plot, you have to take each person's genotype from the genotype file and their
expression from the expression file and put them on the same dot. That one join is an eQTL,
and post 3.3 is built on it.

Top right is a by-product of the genotype file: a map of ancestry, where our European and Yoruba
people sit far apart. Bottom left is the clinical file, with the person's age, BMI and trait as
percentiles among everyone. Bottom right is the methylation at eight CpGs in the promoter of the
teaching gene at that locus.

Try a few people. Some are unremarkable everywhere; some sit at an extreme in one panel and the
middle of the others. Each person is a column in three files and a row in the fourth, and the
only thing holding the picture together is their ID.

## The thread that ties them: IDs

So the ID is everything. And here is how the *same* person, HG00096, is written in the files of our
own little cohort:

| File | How it writes HG00096 | Why |
|---|---|---|
| `cohort.psam`, the VCFs, the matrices, `clinical.tsv` | `HG00096` | the plain sample ID |
| `L01.traw` (PLINK's allele-count table) | `0_HG00096` | PLINK glues the family ID (0, none) to the person's ID |
| GEUVADIS, as downloaded | `HG00096.1.M_111124_6` | one column per sequencing *library*: person, library number, lab batch |

The GEUVADIS names are the instructive ones. The expression file doesn't describe people, it
describes *tubes that went into a sequencer*: 660 libraries from 462 people. Many people were
sequenced more than once, so they have several columns, and the build keeps the deepest library
of each. Then 19 of the 462 have no genotypes in our files, so they are dropped. Only after all that do the 443 expression
columns line up with 443 genotype columns.

The build's inventory step reads every file, turns each file's own ID style back into a plain
sample ID, and checks that every file holds exactly the same 443 people. They do. It sounds
trivial. In real projects it is where weeks disappear: a lab exports `HG00096 ` with a trailing
space, one batch adds a prefix, a spreadsheet turns an ID into a date (it does this to gene names
like *MARCH1* so often that a 2016 survey found the error in a fifth of papers with gene lists),
and a "join" silently drops a tenth of your cohort.

One rule saves most of the pain: **join by ID, never by position.** Two files with 443 columns
each are not necessarily in the same order. Our cohort files happen to list the people in the
same sorted order, because the build wrote them that way, but files that come from different labs
almost never do. Always match on the ID column, and count how many people survived the match.

## Trust the labels, but check them

Matching IDs proves the *labels* agree. It doesn't prove the *data* behind them belong to the same
person. Tubes get swapped. Plates get rotated. A sample sheet gets one row shifted. So the best
studies ask the data themselves.

<iframe src="/finemap/1.1/id-checks.html" title="Sex check, and the identity check of each RNA sample against every genome" width="100%" height="480" style="border:0;" loading="lazy"></iframe>

**The sex check** (left). Women express *XIST*, the RNA that silences their second X; men express
genes that sit on the Y chromosome. So expression alone tells you a person's sex, and you can
compare that with the sex in the sample sheet. In our cohort the two groups separate cleanly, and the expression of every one of the 443 people agrees with the recorded sex. A disagreement doesn't
always mean a swap (sex chromosomes have their own biology), but it is the cheapest alarm there is,
and it catches about half of all swaps for free, because a random swap pairs people of different
sex half the time.

**The identity check** (middle and right). This one is cleverer. At the strongest eQTLs, a
person's genotype predicts their expression: we just saw that with *ERAP2*. So take one RNA
sample, and for every genome in the cohort ask how well that genome's eQTL genotypes predict
this RNA's expression, over the 300 strongest eQTL genes. One genome should fit far
better than the other 442: its own. In the middle panel, RNA sample HG00122 fits its own genome with a score of 0.39. The best of the other 442 genomes scores 0.12, and most sit close to zero.

On the right, every RNA sample: across, how well it fits the genome it is *labelled* with; up, the
best fit to anybody else. A correct label sits below the diagonal line. To see what a mistake
looks like, I swapped the labels of three pairs of RNA samples before running the check. All six jump out,
far above the line, and for each one the best-fitting genome is exactly the person it was swapped
with. In the data as built, no RNA sample fits anybody else better than the person on its label. This is the idea behind tools such as MixupMapper and MBV, which
large projects like GTEx run on every sample.

## Same address, same letter: builds and alleles

The last kind of mismatch is not about people but about variants. To line up two files of
variants, they have to agree on two things: *where* a variant is, and *which allele* they are
counting.

**Where.** A position like `chr5:96,900,000` only means something within one version, or
*build*, of the human reference genome. The same variant sits at different coordinates in GRCh37
(also called hg19, still used by many older studies and resources) and GRCh38 (hg38, which our
playground uses). Merging files from different builds doesn't fail loudly; it matches the wrong
variants, or almost none. Even the chromosome's name varies: our `.pvar` and VCF files call
chromosome 5 `5`, while our variant IDs say `chr5`. Check the build of every file you download, and convert ("lift
over") when they differ.

**Which allele.** A variant has two alleles, and every number about it (a genotype count, an
effect size, an allele frequency) counts one of them. Our genotypes count the **ALT** allele, the
GWAS reports an **effect allele**, and a downloaded file may report either one. Even inside our
own files there is a trap: PLINK's `.traw` table counts whichever allele its `COUNTED` column
says, and in our build that is the REF allele, so the reading code flips it. Swapping the allele
flips the sign of every effect and turns a frequency *p* into *1 − p*.

DNA has two strands, too, and a file can report the allele on the opposite one: an A on one strand
is a T on the other, C pairs with G. Most of the time that is easy to spot, because A/G on one
strand is T/C on the other, which cannot be confused with the original. But for **A/T and C/G
variants**, the other strand looks exactly like the other allele. Only the allele frequency can
tell you which way round they are, and only if it is not close to 50%.

To show this, I took the European GWAS at locus L01 and rewrote it the way another group might
have: every third variant reported for the other allele, every fourth on the other strand. Then I
lined it back up against our own alleles:

<iframe src="/finemap/1.1/alleles.html" title="Allele frequencies before and after harmonising another file's alleles" width="100%" height="490" style="border:0;" loading="lazy"></iframe>

On the left, the file as it arrived: most variants sit on the diagonal, and the third that were swapped
form a second diagonal running the other way, a big X. That X is the fingerprint of mixed-up
alleles, and it is worth plotting for every file you download. On the right, after harmonising,
everything sits on one line. All 7,237 variants found their partner, every kept effect came back
with its correct sign, and only 120 A/T and C/G variants, too close to 50% to call, were dropped.

Notice what the frequencies did there: they decided 1,030 A/T and C/G variants (about one variant in six is A/T or C/G). That only
works when the reference frequencies come from the same ancestry as the file. When I settled the
same variants using our *Yoruba* people's frequencies instead, 31 of them came out the wrong way
round: few, but each one an effect with the wrong sign, and nothing in the file to warn you. Remember post R's flipped allele, which broke fine-mapping at every locus? This
is how that happens.

## A short checklist

Before any analysis in this series, I run through these, and I suggest you do too:

1. **Same people?** Every file, after cleaning IDs, holds the people you expect. Count them.
2. **Joined by ID?** Never by column or row order.
3. **The data agree with the labels?** Sex from expression (or from X-chromosome genotypes), and
   genotype against expression or a second genotyping, when you have them.
4. **Same build?** Every file of positions, on one reference genome.
5. **Same allele?** Effects and frequencies aligned to one allele; A/T and C/G variants settled
   by frequency or dropped.

## Try it yourself

The whole post, every table and figure, runs in a few minutes on the playground from post 0:

```bash
conda activate statgen-r
bash posts/1.1-meet-the-cohort/run_all.sh data results/post-1.1             # R
TRACK=python bash posts/1.1-meet-the-cohort/run_all.sh data results/post-1.1   # Python
```

and `bash posts/1.1-meet-the-cohort/check.sh data` runs both and checks that R and Python give the
same numbers. On a shared cluster, use a compute node.

The heart of it is the join. In R, one person across every file:

```r
library(data.table)
source("lib/statgen.R")

who <- "HG00096"
clinical <- fread("data/cohort/clinical/clinical.tsv")[sample == who]
expr <- fread("data/cohort/expression/expression_int.tsv.gz")
meth <- fread("data/cohort/methylation/methylation_m.tsv.gz")
geno <- read_traw("data/cohort/genotypes/loci/L01.traw")       # ALT allele counts, IDs cleaned
lead <- fread("data/cohort/loci.tsv")[locus == "L01"]

clinical                                                        # one row
expr[gene_id == lead$anchor_gene_id, ..who]                     # one column of a gene x people matrix
geno$g[lead$anchor_lead_id, who]                                # 0, 1 or 2 copies of ALT
meth[1:5, c("cpg_id", who), with = FALSE]

# the eQTL: genotype from one file, expression from another, matched by ID
people <- fread("data/cohort/clinical/clinical.tsv")$sample
x <- geno$g[lead$anchor_lead_id, people]
y <- unlist(expr[gene_id == lead$anchor_gene_id, ..people])
summary(lm(y ~ x))$r.squared
```

And in Python:

```python
import sys
import pandas as pd
sys.path.insert(0, "lib")
import statgen as sg

who = "HG00096"
clinical = pd.read_csv("data/cohort/clinical/clinical.tsv", sep="\t").set_index("sample")
expr = pd.read_csv("data/cohort/expression/expression_int.tsv.gz", sep="\t", index_col="gene_id")
info, g, ids = sg.read_traw("data/cohort/genotypes/loci/L01.traw")   # ALT allele counts
geno = pd.DataFrame(g, index=info["id"], columns=ids)
lead = pd.read_csv("data/cohort/loci.tsv", sep="\t").set_index("locus").loc["L01"]

print(clinical.loc[who])
print(expr.loc[lead.anchor_gene_id, who], geno.loc[lead.anchor_lead_id, who])

# the eQTL, matched by ID (never by position)
people = clinical.index
x, y = geno.loc[lead.anchor_lead_id, people], expr.loc[lead.anchor_gene_id, people]
print(x.corr(y) ** 2)
```

A few things to try:

1. Break the join on purpose: shuffle the expression columns (`sample(people)` in R,
   `people.to_series().sample(frac=1)` in Python) and recompute the r². The eQTL vanishes, and
   nothing warns you.
2. In `03_id_checks`, change the planted swaps, or swap only two people of the same sex, and see
   which of the two checks still catches it.
3. In `04_alleles`, change `AMBIGUOUS = 0.10` to 0 (keep every A/T and C/G variant) and count the
   wrong calls.

<details>
<summary><strong>For the curious</strong>: the formats in a little more detail</summary>

**VCF.** The Variant Call Format is the common language of sequencing: a header of `##` lines that
describe everything (the reference genome, the meaning of each field), then one line per variant
with its chromosome, position, ID, REF and ALT alleles, quality and filters, and then one column
per person. A person's entry is something like `0|1`: allele 0 (REF) on one chromosome copy and
allele 1 (ALT) on the other, with `|` meaning the two copies are phased and `/` meaning they are
not. VCFs are text, so they are readable and large; `.vcf.gz` files compressed with bgzip and
indexed (`.tbi` or `.csi`) let tools jump to a region. BCF is the binary version.

**PLINK.** PLINK 1 uses a trio of files: `.bed` (genotypes packed two bits each), `.bim` (variants)
and `.fam` (people, with family, father, mother, sex and phenotype columns). PLINK 2 uses `.pgen`,
`.pvar` and `.psam`, which also store dosages and multi-allelic variants. They are fast and small,
which is why most association software reads them. Watch the allele PLINK counts: `--export A`
and `A-transpose` count a chosen allele (written in the `COUNTED` column), and PLINK 1 traditionally
counted the *minor* allele, which can differ from one dataset to the next.

**Expression.** Gene-by-person matrices of counts, plus a gene annotation (Ensembl IDs, names,
positions). GEUVADIS uses versioned Ensembl IDs like `ENSG00000164308.12`; our files drop the
version (`.12`), because versions change between annotation releases while the gene stays the
same. Post 3.1 covers normalisation.

**Methylation.** Usually from an array (450K or EPIC) as beta values,
$\beta = M_\text{meth} / (M_\text{meth} + U + \alpha)$, the methylated share of the signal. Beta
is easy to read but squeezed near 0 and 1, so analyses often use the M-value,
$M = \log_2\!\big(\beta / (1 - \beta)\big)$, which behaves more like a normal variable. Our files
store M-values; $\beta = 2^M / (2^M + 1)$ gets you back.

**Clinical.** Usually a spreadsheet, and the messiest file of all: units (kg or lb), codes for
missing values (`NA`, `-9`, `999`, blank), cases coded 1/2 or 0/1, dates in three formats. Our
`clinical.tsv` is tidy because I simulated it.

**How the sex and identity checks work here.** The sex check uses log2 normalised counts of
*XIST* and the mean of five Y-chromosome genes (*RPS4Y1*, *DDX3Y*, *KDM5D*, *EIF1AY*, *UTY*), and
calls "male" when the Y genes are higher. The identity check takes up to 300 genes whose lead eQTL
in the build's own scan has $p < 10^{-10}$, standardises each gene's expression and each lead
variant's genotype across people, weights each genotype by its eQTL correlation, and scores every
RNA sample against every genome by the average product over genes. Tools built for real projects,
such as MBV, are more careful (they use all variants and allow for contamination), but the idea
is the same.

</details>

## Concepts in this post

- **Sample ID:** the label that links one person across files; every join depends on it.
- **Wide and long tables:** one column per person (genotypes, expression, methylation) or one row
  per person (clinical).
- **VCF, PLINK:** the two main formats for genotypes; text with a rich header, or compact binary.
- **Beta and M-values:** two scales for methylation, the methylated fraction and its log-ratio.
- **Sample swap:** data labelled with the wrong person; caught by sex checks and genotype checks.
- **Genome build:** the version of the reference genome that positions refer to (GRCh37 or GRCh38).
- **Allele harmonisation:** making two files count the same allele of every variant.
- **A/T and C/G (palindromic) variants:** variants whose strand can't be told from the alleles
  alone.

## References

1. Danecek P et al. The variant call format and VCFtools. *Bioinformatics* 27, 2156–2158 (2011).
   [doi:10.1093/bioinformatics/btr330](https://doi.org/10.1093/bioinformatics/btr330)
2. Chang CC et al. Second-generation PLINK: rising to the challenge of larger and richer datasets.
   *GigaScience* 4, 7 (2015). [doi:10.1186/s13742-015-0047-8](https://doi.org/10.1186/s13742-015-0047-8)
3. Lappalainen T et al. Transcriptome and genome sequencing uncovers functional variation in
   humans. *Nature* 501, 506–511 (2013). [doi:10.1038/nature12531](https://doi.org/10.1038/nature12531)
4. Koenig Z et al. A harmonized public resource of deeply sequenced diverse human genomes.
   *Genome Research* 34, 796–809 (2024). [doi:10.1101/gr.278378.123](https://doi.org/10.1101/gr.278378.123)
5. Du P et al. Comparison of Beta-value and M-value methods for quantifying methylation levels by
   microarray analysis. *BMC Bioinformatics* 11, 587 (2010).
   [doi:10.1186/1471-2105-11-587](https://doi.org/10.1186/1471-2105-11-587)
6. Westra HJ et al. MixupMapper: correcting sample mix-ups in genome-wide datasets increases power
   to detect small genetic effects. *Bioinformatics* 27, 2104–2111 (2011).
   [doi:10.1093/bioinformatics/btr323](https://doi.org/10.1093/bioinformatics/btr323)
7. Fort A et al. MBV: a method to solve sample mislabeling and detect technical bias in large
   combined genotype and sequencing assay datasets. *Bioinformatics* 33, 1895–1897 (2017).
   [doi:10.1093/bioinformatics/btx074](https://doi.org/10.1093/bioinformatics/btx074)
8. Schneider VA et al. Evaluation of GRCh38 and de novo haploid genome assemblies demonstrates the
   enduring quality of the reference assembly. *Genome Research* 27, 849–864 (2017).
   [doi:10.1101/gr.213611.116](https://doi.org/10.1101/gr.213611.116)
9. Winkler TW et al. Quality control and conduct of genome-wide association meta-analyses.
   *Nature Protocols* 9, 1192–1212 (2014). [doi:10.1038/nprot.2014.071](https://doi.org/10.1038/nprot.2014.071)
10. Hartwig FP, Davies NM, Hemani G, Davey Smith G. Two-sample Mendelian randomization: avoiding
    the downsides of a powerful, widely applicable but potentially fallible technique.
    *International Journal of Epidemiology* 45, 1717–1726 (2016).
    [doi:10.1093/ije/dyx028](https://doi.org/10.1093/ije/dyx028)
11. Frankish A et al. GENCODE 2021. *Nucleic Acids Research* 49, D916–D923 (2021).
    [doi:10.1093/nar/gkaa1087](https://doi.org/10.1093/nar/gkaa1087)
12. Ziemann M, Eren Y, El-Osta A. Gene name errors are widespread in the scientific literature.
    *Genome Biology* 17, 177 (2016). [doi:10.1186/s13059-016-1044-7](https://doi.org/10.1186/s13059-016-1044-7)

*Every figure was made for this post with the code in `posts/1.1-meet-the-cohort/`.*
