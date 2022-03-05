# merkletree-whitelist
example of merkletree

After discussin with solidity dev:

1. static list, merkle tree is best
2. dynamic list signatures (but mainly for adding)
3. mapping,  easiest to add remove, but costs the most in gas  (probably best for low gas fees chains such as Polygon network)
4.  you can do some system where you increment a counter and reissue all the sigs (middle ground)
