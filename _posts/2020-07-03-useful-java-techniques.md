---
layout: post
title: "Useful Java Techniques"
tags: [Java]
---

In this article, I will list some useful techniques that can be used in our daily life as a developer.
#### Convert PriorityQueue to Array
```java
PriorityQueue<int[]> pq = new PriorityQueue<>();
int[][] result = pq.toArray(new int[pq.size()][2]);
```

#### Convert integer array to list
###### Method 1
```java
IntStream.of(arr).boxed().collect(Collectors.toList())
```

###### Method 2
```java
Arrays.stream(stones).boxed().collect(Collectors.toList())
```

#### Convert string array to list
```java
String[] strs = new String[]{"a", "b", "c"};

Arrays.stream(strs).collect(Collectors.toList())
```

#### Using Comparator.comparingInt()
Say we have a priority queue in Java with `List<Integer>` as element, we would like to sort the priority queue based on the first element:
```java
Queue<List<Integer>> pq = new PriorityQueue<>(Comparator.comparingInt(k -> k.get(0)));
```

#### Join List of String into a single String
```java
List<String> list = Arrays.asList("Hello", "world");
String result = list.stream().collect(Collectors.joining(" ")); // result: "Hello world"
```

#### Add Map entries with value initialization
```java
Map<String, List<String>> map = new HashMap<>();
map.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
```

#### Get sum of an array
```java
int[] array = {1, 2, 3, 4};
int sum = Arrays.stream(array).sum();
```
