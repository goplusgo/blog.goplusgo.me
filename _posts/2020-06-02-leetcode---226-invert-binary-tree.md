---
layout: post
title: "LeetCode 226. Invert Binary Tree"
summary: "solutions of leetcode 226. Invert Binary Tree"
tags: [LeetCode, Algorithm]
---

Multple solutions for leetcode 226. Invert Binary Tree.
### Problem
#### Example:
Input:
```
     4
   /   \
  2     7
 / \   / \
1   3 6   9
```

Output:

```
     4
   /   \
  7     2
 / \   / \
9   6 3   1
```
**Trivia:**

This problem was inspired by this original tweet by Max Howell:

> Google: 90% of our engineers use the software you wrote (Homebrew), but you can’t invert a binary tree on a whiteboard so f*** off.

### My solution - DFS

```java
public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;

    TreeNode left = root.left;
    TreeNode right = root.right;

    root.left = invertTree(right);
    root.right = invertTree(left);

    return root;
}
```    

This solution is pretty straigtforward. It's simple and easy to understand. However, this DFS solution might have the risk of stack overflow. Therefore, there're some other approaches use iteration instead of recursion.

### Iteration using stack

```java
public TreeNode invertTree(TreeNode root) {

    if (root == null) {
        return null;
    }

    final Deque<TreeNode> stack = new LinkedList<>();
    stack.push(root);

    while(!stack.isEmpty()) {
        final TreeNode node = stack.pop();
        final TreeNode left = node.left;
        node.left = node.right;
        node.right = left;

        if(node.left != null) {
            stack.push(node.left);
        }
        if(node.right != null) {
            stack.push(node.right);
        }
    }
    return root;
}
```

### BFS using queue

```java
public TreeNode invertTree(TreeNode root) {
    if (root == null) {
        return null;
    }

    final Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);

    while(!queue.isEmpty()) {
        final TreeNode node = queue.poll();
        final TreeNode left = node.left;
        node.left = node.right;
        node.right = left;

        if(node.left != null) {
            queue.offer(node.left);
        }
        if(node.right != null) {
            queue.offer(node.right);
        }
    }
    return root;
}
```

Of all the solutions above, solution #2 might be the most efficient way. Meanwhile, if we know the tree is not large, solution #1 would be the best approach as simplicity is the most elegant. 
