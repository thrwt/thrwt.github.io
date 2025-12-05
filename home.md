---
title: "Home"
layout: default
---

# 🧩 CTF Writeups

Welcome to my CTF writeups hub.  
Below you can find all writeups I published.

---

{% for post in site.posts %}
### [{{ post.title }}]({{ post.url }})
**Date:** {{ post.date | date: "%Y-%m-%d" }}

{{ post.excerpt }}

---

{% endfor %}
