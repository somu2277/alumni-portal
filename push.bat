@echo off
git config user.email "239x1a0554@gprec.ac.in"
git config user.name "239x1a0554-star"
git remote add origin https://github.com/239x1a0554-star/alumni-portal.git
git add .
git commit -m "feat: complete modern overhaul of Alumni Portal"
git branch -M main
git push -u origin main
