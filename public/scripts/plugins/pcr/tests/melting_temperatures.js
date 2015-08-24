var Tms = {
  'GGGGTCCTAAAAATAATAATGGCATACAGG': 65.4,
  'GGGGTCCTAAAAATAATAATGGCATACAG': 64,
   'GGGTCCTAAAAATAATAATGGCATACAGGG': 65.4,
   'GGGTCCTAAAAATAATAATGGCATACAGG': 64,
             'AATAATAATGGCATACAGGGTGGTG': 63.1,

  'CGTACAGCACGTATGGTTCA': 61.9,
  'CTCTAGTACTACTACTTTTCAACAGGC': 62.4,

  'GAGGGAGAGGTTATTTTCCTTATCTATGTG': 64.4,
  'GTGTATCTATTCCTTTTATTGGAGAGGGAG': 64.4, // inverse sequence

  'ATTGATTACGTACAGCACGTATGG': 62.8,
  'CCATACGTGCTGTACGTAATCAAT': 62.8, // inverse sequence

  'GGTATGCACGACATGCATTAGTTA': 63.1,
  'TAACTAATGCATGTCGTGCATACC': 63.1, // inverse sequence

  'GCTAAAGGCCGTCAAAGATGT': 62.9,
  'GCTAAAGGCCGTCAAAGATGTG': 63.6,
  'GCTAAAGGCCGTCAAAGATGTGT': 65.2,
  'GCTAAAGGCCGTCAAAGATGTGTA': 64.8,
  'GCTAAAGGCCGTCAAAGATGTGTAT': 65,
  'GCTAAAGGCCGTCAAAGATGTGTATA': 64.8,
  'GCTAAAGGCCGTCAAAGATGTGTATAT': 65,
  'GCTAAAGGCCGTCAAAGATGTGTATATA': 64.7,
  'GCTAAAGGCCGTCAAAGATGTGTATATAA': 65.1,
  'GCTAAAGGCCGTCAAAGATGTGTATATAAG': 65.3,
   'CTAAAGGCCGTCAAAGATGTGT': 62.8,
   'CTAAAGGCCGTCAAAGATGTGTA': 62.5,
   'CTAAAGGCCGTCAAAGATGTGTAT': 62.9,
   'CTAAAGGCCGTCAAAGATGTGTATA': 62.7,
   'CTAAAGGCCGTCAAAGATGTGTATATAAGC': 65.3,
    'TAAAGGCCGTCAAAGATGTGT': 62.2,

  'TTAAGACGGAGCACTATGCG': 61.7,
  'TTAAGACGGAGCACTATGCGG': 63.9,

  'AGAGACTTACCGCCCTCATA': 61.8,
  'AGAGACTTACCGCCCTCATAC': 62.7,

  'AGTCGTGCTAGATTTCTCAGTAAG': 61.8,
  'AGTCGTGCTAGATTTCTCAGTAAGA': 63.1,

  'CCATCGGGGTTTGGTCCTTTA': 64.1,
   'CATCGGGGTTTGGTCCTTTA': 61.9,

  'ATTCACTCCAGAGCGATGAAAA': 62.3,
   'TTCACTCCAGAGCGATGAAAA': 61.9,

  'GAATATAACCTTTCATTCCCAGCGGTC': 65.2,
   'AATATAACCTTTCATTCCCAGCGGTC': 64.9,

  'TATCAAAATTGCTGTCTGCCAGGTG': 65.5,
   'ATCAAAATTGCTGTCTGCCAGGTG': 65.9,
    'TCAAAATTGCTGTCTGCCAGGTG': 65.7,
     'CAAAATTGCTGTCTGCCAGGTG': 64.4,

  'GCTAATTTTGCACATAACTCTAGT': 59.7,
   'CTAATTTTGCACATAACTCTAGT': 57.1,
    'TAATTTTGCACATAACTCTAGT': 56.2,
     'AATTTTGCACATAACTCTAGT': 56.1,
      'ATTTTGCACATAACTCTAGT': 55.2,

  'AAAAAAATGATTTTTTTGGC': 53.2,
  'AAAAAAATGATTTTTTTGGCA': 55.3,
  'AAAAAAATGATTTTTTTGGCAA': 56.3,
  'AAAAAAATGATTTTTTTGGCAAT': 56.9,
  'AAAAAAATGATTTTTTTGGCAATT': 57.7,
  'AAAAAAATGATTTTTTTGGCAATTT': 58.5,
  'AAAAAAATGATTTTTTTGGCAATTTT': 59.2,
  'AAAAAAATGATTTTTTTGGCAATTTTA': 59.2,
  'AAAAAAATGATTTTTTTGGCAATTTTAG': 59.9,
  'AAAAAAATGATTTTTTTGGCAATTTTAGA': 61.1,
  'AAAAAAATGATTTTTTTGGCAATTTTAGAT': 61.5,

  'ACTAGAGTTATGTGCAAAAT': 55.2,
  'ACTAGAGTTATGTGCAAAATT': 56.1,
  'ACTAGAGTTATGTGCAAAATTA': 56.2,
  'ACTAGAGTTATGTGCAAAATTAG': 57.1,
  'ACTAGAGTTATGTGCAAAATTAGC': 59.7,
  'ACTAGAGTTATGTGCAAAATTAGCT': 61.1,
  'ACTAGAGTTATGTGCAAAATTAGCTT': 61.7,
  'ACTAGAGTTATGTGCAAAATTAGCTTC': 62.2,
  'ACTAGAGTTATGTGCAAAATTAGCTTCT': 63.4,
  'ACTAGAGTTATGTGCAAAATTAGCTTCTA': 63.2,
  'ACTAGAGTTATGTGCAAAATTAGCTTCTAT': 63.5,

  'ATAGAAGCTAATTTTGCACA': 55.8,
  'ATAGAAGCTAATTTTGCACAT': 56.5,
  'ATAGAAGCTAATTTTGCACATA': 56.6,
  'ATAGAAGCTAATTTTGCACATAA': 57.4,
  'ATAGAAGCTAATTTTGCACATAAC': 58.4,
  'ATAGAAGCTAATTTTGCACATAACT': 59.9,
  'ATAGAAGCTAATTTTGCACATAACTC': 60.5,
  'ATAGAAGCTAATTTTGCACATAACTCT': 61.8,
  'ATAGAAGCTAATTTTGCACATAACTCTA': 61.7,  // Interesting
  'ATAGAAGCTAATTTTGCACATAACTCTAG': 62.2,
  'ATAGAAGCTAATTTTGCACATAACTCTAGT': 63.5,


  'GAAAGAAGAAGAAGAAGAAG': 53.7,
  'GAAAGAAGAAGAAGAAGAAGA': 55.6,
  'GAAAGAAGAAGAAGAAGAAGAA': 56.4,
  'GAAAGAAGAAGAAGAAGAAGAAG': 57.3,
  'GAAAGAAGAAGAAGAAGAAGAAGA': 58.8,
  'GAAAGAAGAAGAAGAAGAAGAAGAA': 59.5,
  'GAAAGAAGAAGAAGAAGAAGAAGAAG': 60.1,
  'GAAAGAAGAAGAAGAAGAAGAAGAAGA': 61.4,
  'GAAAGAAGAAGAAGAAGAAGAAGAAGAA': 61.9,
  'GAAAGAAGAAGAAGAAGAAGAAGAAGAAA': 62.4,
  'GAAAGAAGAAGAAGAAGAAGAAGAAGAAAA': 62.8,


  'GCTGAGCCAT': 40.8,
  'GCTGAGCCATT': 43.6,
  'GCTGAGCCATTC': 46.7,
  'GCTGAGCCATTCC': 51.3,
  'GCTGAGCCATTCCC': 55.2,
  'GCTGAGCCATTCCCC': 58.7,
  'GCTGAGCCATTCCCCT': 60.8,
  'GCTGAGCCATTCCCCTT': 61.4,
  'GCTGAGCCATTCCCCTTC': 62.2,
  'GCTGAGCCATTCCCCTTCA': 64.1,
  'GCTGAGCCATTCCCCTTCAG': 64.6,
   'CTGAGCCATTCCCCTTCAGA': 63.4,
   'CTGAGCCATTCCCCTTCAGAT': 63.7,

  'CCCCTTACCCGCCGACGGGT': 72,
  'CCCCTTACCCGCCGACGGGTC': 71.9,
  'CCCCTTACCCGCCGACGGGTCA': 73.2,
  'CCCCTTACCCGCCGACGGGTCAA': 73.1,
  'CCCCTTACCCGCCGACGGGTCAAA': 73,
  'CCCCTTACCCGCCGACGGGTCAAAA': 73,
  'CCCCTTACCCGCCGACGGGTCAAAAT': 72.9,
  'CCCCTTACCCGCCGACGGGTCAAAATT': 72.8,

  'TCGCATTGTGCGGGGTCCAC': 69.2,
  'TCGCATTGTGCGGGGTCCACA': 70.7,
  'TCGCATTGTGCGGGGTCCACAT': 70.6,

  'AGTCCAACTTCGACAGGGATTCG': 65.8,
  'AGTCCAACTTCGACAGGGATTCGA': 67,

  'CAGTCCAACTTCGACAGGGATTCG': 66.3,
  'CAGTCCAACTTCGACAGGGATTCGA': 67.4,

  'CGCAACTCTCTACTGTTTCTCCATA': 63.8,
   'GCAACTCTCTACTGTTTCTCCATA': 61.9,

  'CAGCCTTAGCATTAGATGATGGTTTATTGG': 65.7,
   'AGCCTTAGCATTAGATGATGGTTTATTGG': 65.3,
    'GCCTTAGCATTAGATGATGGTTTATTGG': 64.2,

  'CTGGTGGAGGATGGAAATCTAATC': 62.4,
   'TGGTGGAGGATGGAAATCTAATC': 61.8,

  'AGATCACTACCGGGCGTATT': 62.7,
   'GATCACTACCGGGCGTATT': 61,
   'GATCACTACCGGGCGTATTAAA': 61.9,
   'GATCACTACCGGGCGTATTAAAA': 62.4,

  'CTATTCCTTTTATTGGAGAGGGAGG': 62.2,
    'ATTCCTTTTATTGGAGAGGGAGG': 61.9,
     'AAAATTTTATTGGAAGGGGAGGAGG': 63.3,
  'GGGGCTCGATATCCATGTTAATAT': 62.1,

  'CCCCCTTCTCTCCAATAAAATCT': 61.9,
  'CCCCCTTCTCTCCAATAAAATCTAT': 62,

   'TCCTCCTCCCCTTCCAATAA': 61.9,
  'TTCCTCCTCCCCTTCCAATAA': 62.5,

  'GGGGAACCAATACTGGTTGTG': 62.8,
   'GGGAACCAATACTGGTTGTGA': 62.1,

  'ACGGGTCAAAATCTGAAGGG': 62.1,

  'TCACCAATAAAAAACGCCCG': 61.5,
  'TCACCAATAAAAAACGCCCGG': 63.6,
  'TCACCAATAAAAAACGCCCGGC': 66.1,
  'TCACCAATAAAAAACGCCCGGCG': 67.9,

  'GCTCGGTTGCCGCCGGGCGT': 75.8,
  'GCTCGGTTGCCGCCGGGCGTT': 75.5,
  'GCTCGGTTGCCGCCGGGCGTTT': 75.3,
  'GCTCGGTTGCCGCCGGGCGTTTT': 75.2,
  'GCTCGGTTGCCGCCGGGCGTTTTT': 75,
  'GCTCGGTTGCCGCCGGGCGTTTTTT': 74.9,
  'GCTCGGTTGCCGCCGGGCGTTTTTTA': 74.2,
  'GCTCGGTTGCCGCCGGGCGTTTTTTAT': 74,

  'CCGTCACGGAGTATCGTTATTT': 62,
   'CCGTCACGGAGTATCGTTATT': 61.5,

  'GAAAGAAGAAGAAGAAGAAGAAGAAGAAAAA': 63.2,
  'GAAAGAAGAAGAAGAAGAAGAAGAAGAAAAAA': 63.6,
  'GAAAGAAGAAGAAGAAGAAGAAGAAGAAAAAAA': 64,


         'GGTTTGGGTTTGGGTTTGGGTTT': 66.3,
         'GGTTTGGGTTTGGGTTTGGGTTTG': 66.8,
         'GGTTTGGGTTTGGGTTTGGGTTTGG': 68.4,
   'CATCAGGGTTTGGGTTTGGGTTTG': 66.2,
   'CATCAGGGTTTGGGTTTGGGTTTGG': 67.8,
  'TCATCAGGGTTTGGGTTTGGGT': 66.3,
  'TCATCAGGGTTTGGGTTTGGGTT': 66.6,
  'TCATCAGGGTTTGGGTTTGGGTTT': 66.9,
  'TCATCAGGGTTTGGGTTTGGGTTTG': 67.3,
        'GGGTTTGGGTTTGGGTTTGGG': 66.1,
        'GGGTTTGGGTTTGGGTTTGGGT': 67.6,

  'TCATCAAGGTTTGGGTTTGGGTTTGG': 67.6,
   'CATCAAGGTTTGGGTTTGGGTTTGG': 66.5,
   'CATCAAGGTTTGGGTTTGGGTTTGGG': 68,

  'TGACCCAAACCCAAACCCAAACC': 67.5,
      'CCAAACCCAAACCCAAACCCAAA': 66.3,
      'CCAAACCCAAACCCAAACCCAAAC': 66.8,
      'CCAAACCCAAACCCAAACCCAAACC': 68.4,

  'GTGCCCTGACCCAAACCCA': 66.7,
  'GTGCCCTGACCCAAACCCAA': 67,

  'CGGTTTGGGTTTGGGTTTGGG': 66.2,
  'CGGTTTGGGTTTGGGTTTGGGT': 67.7,

  'AGTTTGGGTTTGGGTTTGGGTTTGG': 68,
  'AGCCCGGGTTTGGGTTTGG': 67.4,

  'GCCCGGGTTTGG': 54.3,
  'GCCCGGGTTTGGG': 58.3,
  'GCCCGGGTTTGGGT': 61.1,
  'GCCCGGGTTTGGGTT': 61.8,
  'GCCCGGGTTTGGGTTT': 62.4,
  'GCCCGGGTTTGGGTTTG': 63.4,
  'GCCCGGGTTTGGGTTTGG': 65.9,
  'GCCCGGGTTTGGGTTTGGG': 68.1,

  'ATACGTCGCGCAGCTCA': 63.5,
  'ATACGTCGCGCAGCTCATAG': 63.9,
   'TACGTCGCGCAGCTCA': 63.2,
   'TACGTCGCGCAGCTCAT': 63.5,

  'GAGCCCGGGTTTGGGTTTG': 65.5,
  'GAGCCCGGGTTTGGGTTTGG': 67.6,

  'ATGCCCTGACCCAAACCCA': 66.2,
  'ATGCCCTGACCCAAACCCAA': 66.5,
  'ATGCCCTGACCCAAACCCAAA': 66.8,
  'ATGCCCTGACCCAAACCCAAAC': 67.4,

  'TGCCCTGACCCAAACCCA': 66.1,
  'TGCCCTGACCCAAACCCAA': 66.4,
  'TGCCCTGACCCAAACCCAAA': 66.7,
  'TGCCCTGACCCAAACCCAAAC': 67.3,

  'CCCGGGTTTGGGTTTGGG': 65.3,
  'CCCGGGTTTGGGTTTGGGT': 67.1,


  'AAAGGGAAAGGGAAAGGGAAAGGG': 66.6,
  'CTATCACAAGTGGGAACAATGTGG': 63.4,
  'AACAATGTGGCAAAAGGTACTCGTT': 65.6,
  'AAGGTACTCGTTTGACTTTGCA': 62.6,
  'CCTATCTGACTGGTAATAGTTCGAACTACT': 64.9,
  'AAAAGTAGCGAGACCTCACTTATG': 62.3,
  'CGTCCAATTACAGTACTCTTAAGACC': 62.6,
  'GCCCAAATTGCGGCTAACTC': 63.9,
  'AGGAGATTCATTGCACAAACAAGC': 64.2,
  'GTTAAGGTAAACTACGAGTTTGGTTAGAGG': 64.8,
  'GGCTTCAACTGATATAGAGTGGAAT': 62.3,
  'CACGACATGCATTAGTTATTATGGG': 62,
  'GAATTCTCATGACATTAACCTGCAG': 62.1,
  'GCATGAGAGGCCATTTAATTATACG': 62,
  'TGAACGCTTGCTTGGTTCTG': 63.3,
  'TCGTTAATCGCTTCCATGCG': 62.8,
  'GGGGATCATTTTGCGCTTCA': 63.3,
  'GGGCTAGCAGGGAAAATAATGAATA': 62.9,
  'GTTCCATTATCAGGAGTGACATCT': 62,
  'CAGCTAGATCGATACGCGAAAATTT': 63.5,
  'CGAACAAACACGTTACTTAGAGGAAGA': 64.6,
  'CCGTAGGTGTCGTTAATCTTAGAGAT': 63.4,
  'GAGGACGTTACAAGTATTACTGTTAAGGAG': 64.4,
  'GGAAGAGTCTCGAGCAATTACTCAAAA': 64.8,
  'GGCGTGATTTTGTTTTACAAGGACA': 64.5,
  'TGGTATTGTTGGAGCACCTATTAC': 62.5,
  'GAAACCAAAGAACGCTATGCAATTC': 63.3,
  'GAGAGGGTATGACTGTCCATACTGAATATA': 64.7,
  'GTTGGAGATTGGTTTGAGCATCAAATG': 65,
  'TATGCTCGGGCTCTTGATCC': 63.4,
  'GAGACTGCTCATTGGATATTATCGA': 62.1,
  'GCCGATGCTTTTGCATACGTAT': 63.7,
  'TCATAGCTCACGCTGTAGGT': 62.5,
  'CACGTTAAGGGATTTTGGTCATG': 62,
  'TAACCTTTCATTCCCAGCGG': 62.2,
  'CTCATCCTCGTTTAATTCCACATGA': 62.9,
  'TATCTATTCCTTTTATTGGAGAGGGAGGAG': 65,
  'ACTTGGTATGCACGACATGC': 62.9,
  'GGTATGCACGACATGCATTAGTT': 63.4,
  'TAACCTTTCATTCCCAGCGGTC': 64.4,
  'TGTTCCATTATCAGGAGTGACATC': 62.2,
  'CCGTAGGTGTCGTTAATCTTAGAGA': 63.1,
  'CGTTACAAGTATTACTGTTAAGGAGCG': 63.4,
  'GCCGATGCTTTTGCATACGTA': 63.4,
  'CTCATAGCTCACGCTGTAGG': 61.4,
  'TCTCATAGCTCACGCTGTAGG': 62.9,
  'GACAAGCAAACATGCTGTGC': 62.6,
  'CCGAAAGGTGTTTCTGTTCACTT': 63.4,
  'TCTCGTCCCTGATTTTTCACC': 62,
  'TGTTTCTATGACCAGCAAGCC': 62.6,
  'TCTCCAGTACCTAGTTAGGTTTGT': 62.5,
  'GCTGCTAGTTTGTCAGCGAG': 62.8,
  'TCAATCAGTGACGAAGGCAG': 62,
  'AGATCAAATGTCGAAAGGTCGT': 62.2,
  'GGTATGACTCATATGTAAATGCGACCA': 64.6,
  'GGAATAACATCTGAAGAAACGTTGG': 62.2,
  'CAGTGAGAATGGACCTAAGCAATATGTATC': 64.9,
  'GGCTCTCATGATGACTATTATGAATCG': 63.1,
  'CCCGTGTTTCCAACATCTGTTTTTA': 64.1,
  'TGAGATTGTTCGGCGCTTAAAT': 63,
  'GCGGGAGGTACAGGTTTATCATATATA': 63.5,
  'CCGAAAAGATTACTTCGCGTTCT': 63.1,
  'TATCTCAGTTCGGTGTAGGTCGTTC': 65,
  'CAAAAAGGATCTTCACCTAGATCCT': 62.3,
  'ACTCGTTAATCGCTTCCATGCG': 64.9,
  'CTAATTTGATATCGAGCTCGCTTGG': 63.4,
  'CGTTCTGAACAAATCCAGATGGA': 62.8,
  'GCATGTCGTGCATACCAAGT': 62.9,
  'TTGCTGGAATCGCCCGC': 65.2,
  'TTTTTCCGAAGGTAACTGGCT': 62.2,
  'TTCAGCAGAGCGCAGATACC': 64,
  'GCAGATACCAAATACTGTCCTTCTAGTGTA': 65.5,
  'CAGATACCAAATACTGTCCTTCTAGTGTA': 63.7,
  'TACCAGCGGTGGTTTGTTTG': 63,
  'TTTTCCGAAGGTAACTGGCTT': 62.2,
  'CGTTCTGAACAAATCCAGATGGAG': 63.3,
  'TTTATTGGAGAGGGAGGAGGA': 61.9,
  'TTTTATTGGAGAGGGAGGAGGA': 62.4,
  'GCCACTGTACGATTTGATCAATATG': 62.1,
  'GTGGGGGAACCAATACTGGT': 63.7,
  'CACCACCCTGTATGCCATTATTATT': 63.1,
  'ATTGGTTCCCCCACGTAAAC': 62.4,
  'GATCACTACCGGGCGTATTAA': 61.4,
  'TTCTTAGACGTCAGGTGGCA': 63,
  'TAACGATACTCCGTGACGGA': 62.1,
  'CCCTGACCCAAACCCAAACCC': 67.2,
};


export default Tms;
