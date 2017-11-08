
# coding: utf-8

# In[1]:


import cairosvg
import sys


# In[2]:


topic_num = sys.argv[1] if len(sys.argv) > 1 else 500
for i in range(topic_num):
    print(i, end = " ", flush=True)
    cairosvg.svg2png(url=f"topic-graph-svg/graph-{i}.svg", write_to=f"topic-graph-png/graph-{i}.png", )

