---
title: "Left-padding string with zero using JavaScript"
date: "2013-11-29"
categories:
  - wordpress
---

# 使用JavaScript 左邊補零固定字串長度

有時數字字串要固定長度，需要在左邊或右邊補零，例如:

> **123** 左邊補零為八位數 **00000123**  
> **54321** 左邊補零為八位數 **00054321**

以下簡短的JavaScript程式碼片段利用recursive即可達到這個效果:

```javascript
function padleft (YourNumber, OutputLength){
    if (YourNumber.length >= OutputLength) {
        return YourNumber;
    } else {
        return padleft("0" +YourNumber, OutputLength);
    }
}
```

要改為右邊補零，只需要修改return值即可

> Written with [StackEdit](https://stackedit.io/).
