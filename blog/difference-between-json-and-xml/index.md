---
title: "Difference between JSON and XML"
date: "2013-12-04"
---

## JSON與XML差異比較

JSON與XML是兩種常見的資料表示方式，雖然類似但是仍有一些不同的地方，在使用上也有些差異。

## Definition

根據維基百科的定義:

> **JSON**, or **JavaScript Object Notation**, is an open standard format that uses human-readable text to transmit data objects consisting of attribute–value pairs. It is used primarily to transmit data between a server and web application, as an alternative to XML.

[JSON](http://en.wikipedia.org/wiki/JSON) 是一種Object Notation，使用人類易讀的表示方式，來傳遞資料物件的一種標準格式，常用於網路應用程式與伺服器溝通。雖然JSON一開始是由JavaScript發展出來，但他是一個完全language-independent的資料格式，許多的程式語言都可以使用他。

> **Extensible Markup Language** (**XML**) is a markup language that defines a set of rules for encoding documents in a format that is both human-readable and machine-readable. It is defined in the XML 1.0 Specification produced by the W3C, and several other related specifications, all free open standards.

[XML](http://en.wikipedia.org/wiki/XML) 是一種Markup Language，用以將文件加上人類和機器皆可讀的標記，來格式化文件，最早由W3C制定規格。

## Difference

_以下採用[Stack Overflow網友提供的解答](http://stackoverflow.com/questions/2620270/what-is-the-difference-between-json-and-xml)說明_

最基礎的差異，就如他們的名字所表示，**XML**是一種_Markup Language_，而**JSON**是一種_Object Notation_。

* * *

Markup Language 顧名思義就是在純文字上以標記的方式添加額外資訊的一種方法，例如這裡有一串純文字:

`Here is some text.`

使用XML將之格式化後:

```XML
<Document>
    <Paragraph Align="Center">
        Here <Bold>is</Bold> some text.
    </Paragraph>
</Document>
```

這很清楚的展現了Markup Language在呈現文件是有多麼的好用。

而像是JSON這樣的Object Notation則沒有Markup Language那麼的彈性自由，不過這是好事，通常想要呈現物件的時候，都不太需要彈性自由，只要能簡單呈現即可。

如果要使用JSON表示上面XML的範例，首先必須手動解決一些XML有幫你處理好的細節:

```JSON
{
    "Paragraphs": [
        {
            "align": "center",
            "content": [
                "Here ", {
                    "style" : "bold",
                    "content": [ "is" ]
                },
                " some text."
            ]
        }
    ]
}
```

這看起來沒有XML簡潔，原因就是因為我們想用Object Notation來呈現Markup Language的格式，因此需要「發明」一些欄位來裝一些格式化的資訊、陣列或物件。

* * *

換個角度來看，如果你有一個典型的階層架構物件想要呈現，JSON就會比XML來的更加適合:

```JSON
{
    "firstName": "Homer",
    "lastName": "Simpson",
    "relatives": [ "Grandpa", "Marge", "The Boy", "Lisa", "I think that's all of them" ]
} 
```

這是邏輯上等價的XML表示方法:

```XML
<Person>
    <FirstName>Homer</FirstName>
    <LastName>Simpsons</LastName>
    <Relatives>
        <Relative>Grandpa</Relative>
        <Relative>Marge</Relative>
        <Relative>The Boy</Relative>
        <Relative>Lisa</Relative>
        <Relative>I think that's all of them</Relative>
    </Relatives>
</Person>
```

由上面的比較可以清楚看到，JSON比較像是我們在寫程式宣告物件的方式，也少了很多冗贅繁複的多餘標籤。

另外最重要的一點是，Object Notation有明確的標準格式來區分 _record_ 和 _list_

> **record** 內含物件未排序，使用名稱做識別  
> **list** 內含物件有排序，使用位置(index)做識別

Object Notation一定要有這樣的規範標準，不然就完全無法使用。而相對的Markup Language就沒有這種區分，以上面的XML為例，`<person>`是一個_record_、而`<Relatives>`是一個_list_，但是你沒辦法輕鬆的從他的syntax中看出來。

相對的，Markup Language有 _elements_ 和 _attributes_ 的概念，這和Object Notation的 _record_ 和 _list_ 又是不同的東西。

透過額外的schema和user-defined attributes，當然也可以用XML實作 _record_ 和 _list_ 這樣標記的效果，而JSON的優點就是他內建了這樣的規範，簡單清楚又泛用，也就是說JSON的 _self describing_ 比較好，這也是Markup Language和Object Notation所共同想達到的目標。

**所以，當要使用Object Notation時，JSON當然是首選，若要做document markup，則XML會更優。**

> Written with [StackEdit](https://stackedit.io/).
