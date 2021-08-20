git fetch
clear
git pull 
git add .
git status
read -p "Enter your commit name: " COMMIT
git commit -m "${COMMIT}"
git push

