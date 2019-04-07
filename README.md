# Twitter Valence

## To use

* Clone the repo: `git clone https://github.com/twittervalence/twitter.git`

* Initialize repo: `git init`

* Add file(s) to staging: `git add .`

* Commit staged file(s): `git commit -m 'commit message' .`

* Set remote repo: `git remote add origin https://github.com/twittervalence/twitter.git`

* Push file(s) to repo: `git push -u origin master`

**PS** Advisable to work in a branch if not sure and then, someone would merge to master when sure.

* Check current branch: `git branch`

* Switch to desired branch with: `git checkout <branch_name>` [Remove angle brackets]

* Switch back to master: `git checkout master`

* Push changes on branch to: `git push origin <branch_name>` [Remove angle brackets]

### FIXING ISSUES

* Remove remote commits until this point's commit id: `git push origin +eb7b86e^:master`

* Reset to branch of parent commit: `git reset HEAD^ --hard`

* Force push to remote: `git push origin -f`

## Libraries Used

&rightarrow; `pip install tweepy`

&rightarrow; `pip install msgpack` [ __tweepy needs this__]

* Upgrade pip using: `sudo pip install --upgrade pip`

* To list local installed python modules: `pydoc modules`

[TwitterValence](#)

Check python package versions in terminal

`$ python`

`>>> import tweepy`

`>>> print 'tweepy version: %s' %tweepy.__version__`

## Additional Notes

&#10033; This [site](https://boundingbox.klokantech.com/) was used to derive boudingbox coordinates.

