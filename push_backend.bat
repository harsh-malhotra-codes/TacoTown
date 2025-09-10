@echo off
cd "c:/Users/verma/OneDrive/Desktop/working taco - Copy/Backend"
git init
git remote add origin https://github.com/harsh-malhotra-codes/TacoTownBack.git
git add .
git commit -m "Initial commit: TacoTown Backend"
git branch -M main
git push -u origin main
echo Backend pushed successfully!
