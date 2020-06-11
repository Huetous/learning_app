Learning App / Приложение для обучения
=============================

This repository is a part of the implementation of my bachelor work on developing the server side of a mobile app for teaching students.

***Note: further, the term "function" should be understood as a graph of function, the term "task" should be understood as a test task (for example, " pick a pair for graph")

------------
Данный репозиторий является частью реализации моей дипломной работы по разработке серверной части мобильного приложения для обучения студентов.

***Заметка: далее под терминином "function" следует понимать график функции, под термином "task" следует понимать тестовое задание (к примеру, "подберите пару графику")

### Directory / Директория
------------

      Functions/           Main classes for creating functions
      Tasks/               Methods for creating tasks
      Utils                Additional methods


### More details

Function directory.
- FunctionBehaviour - class that allows to control function behaviour (eg to change function parameters so that it starts, or ends
at grid node)
- FunctionBuilder - class which is used to create new objects of FunctionObj class based on custom settings which are set by FunctionBuilder`s public methods.
- FunctionComparisons - class that allows to compare two given objects of FunctionObj class by value, by text, by sign and so on.
- FunctionObj - one of the main classes, represents a function which is used as question or answer in tasks.
- FunctionValues - class that allows to calculate area under curve of a function on all segment or on some part of it and so on.

Tasks directory.
- G2G - "graph to graph" task - a method which returns a one G2G task. In this task, a student must find a pair graph of function  for graph of function in question.
- RS - "relation signs" task - a method which returns a one RS task. In this task, a student must choose correct sign for given inequalities.

Utils - additional methods for classes Number and Array, for the purpose of convenience.

