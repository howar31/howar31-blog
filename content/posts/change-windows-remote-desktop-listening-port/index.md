---
title: "Change Windows Remote Desktop Listening Port"
date: "2014-02-17"
categories:
  - wordpress
---

# 修改Windows遠端桌面連線Port

1. Open Registry Editor: `Win + R` > `regedit`
2. Navigate to registry on the left: `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Terminal Server\WinStations\`
3. Select entry on the right: `PortNumber`
4. Edit the value you want. **Remember select Decimal base unless you know you are entering hex value.**
5. Restart you computer.

> Written with [StackEdit](https://stackedit.io/).
