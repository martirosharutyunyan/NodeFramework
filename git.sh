git fetch
clear
git add .
git status
read -p "Enter your commit name: " COMMIT
git commit -m "${COMMIT}"
git pull 
git push

