* I committed locally and regret it --> Undo
  * `git reset --soft HEAD-1`
* I pushed it and need to undo safely --> Revert
  * `git revert <hash>`
* My commits are messy, I want to redo them --> Reset to commit
  * `git reset --mixed <hash>`
* A PR merged into main needs rollback --> Revert PR
  * `git revert -m 1 <merge-hash>`
* What I check first:
  * Branch name 
    * `git branch --show-current`
  * Pushed vs. Not Pushed 
    *  `git status` 
       *  Pushed? 
          *  use `revert` 
       *  Local only? 
          *  Use reset
  * Is it on main? 
    * Yes 
      * Revert and PR only. 
      * Never force-push to main.
  