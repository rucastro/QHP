Module to override environment files with multiple patches (combined because is the only way).

1) Remove "published" object from user environment.
2) Add "sessionPublished" object on user environment.
3) Add "sessionPublished" object on shopping and checkout environments

the reference implementation only has publish, and that is suboptimal because it’s printed on user environment
so we splitted it in 2
one for things that can be cached (published)
and other for user data (session publish)