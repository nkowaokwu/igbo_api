## Accessing the server from an android device

To access the local server on Windows operating system,
turn on WiFi Hotspot on your Android phone and connect your Laptop to your phone.

Open  command prompt and enter 
`ipconfig. `

The command returns an output similar to this

```
Wireless LAN adapter Wireless Network Connection:
 Connection-specific DNS Suffix . : 
 Link-local IPv6 Address . . . . . : fe80::80bc:e378:19ab:e448%11
 IPv4 Address. . . . . . . . . . . : 192.168.43.76
 Subnet Mask . . . . . . . . . . . : 255.255.255.0 
 Default Gateway . . . . . . . . . : 192.168.43.1
```

Copy the IPv4 address.
In this case
`192.168.1.5 `

Start the API local server on your computer, then access the server using the IPv4 address from above, and its port (8080)
For example 
` "192.168.1.5:8080"  `  in your phone's browser. 



**Note:** When accessing from an app, 
Ensure internet permission has been added to the Android Manifest file :

<uses-permission android:name="android.permission.INTERNET"/>
