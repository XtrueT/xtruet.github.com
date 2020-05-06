---
layout: post
title: Android与PythonFlask的会晤
date: 2020-05-06
author: 霁
header-img:
catalog: true
categories:
- 学习
- Android
tags:
- Android
---

### First

在我们安装好Android studio后可以参照

[常用设置](https://www.jianshu.com/p/a8c0bae07689?utm_source=oschina-app)

搞一下我们的开发环境。

当然，还有我们的基础教程。

我发现了一个还不错的：[教程]([10.10 传感器专题(1)——相关介绍 · Android基础入门教程 · 看云](https://www.kancloud.cn/kancloud/android-tutorial/87281))

### 项目

作为一个采集传感器数据的简易App

我目前的进度就是

1.  数据采集展示
2. 绘制x、y、z数据
3. 发送到后端服务器

选择的是版本好像是Android 10。

新建好项目。

### 界面

开始随便弄一下我们的界面

```xml
<!-- activity_main.xml -->
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="5dp"
    android:background="#eee"
    android:orientation="vertical"
    tools:context=".MainActivity">

    <TextView
        android:id="@+id/tv_title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="三轴传感器数据显示"
        android:textSize="16sp"
        android:layout_gravity="center_horizontal"
        android:layout_marginTop="35dp"/>
    <TextView
        android:id="@+id/tv_result"
        android:layout_gravity="center_horizontal"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text=""
        android:textColor="#222222"
        android:textSize="25sp"/>

    <SurfaceView
        android:id="@+id/sv_result"
        android:layout_width="match_parent"
        android:layout_height="249dp"
        android:layout_gravity="center_horizontal"
        android:layout_margin="5dp"
        android:padding="10dp" />

    <Button
        android:id="@+id/btn_start"
        android:layout_width="match_parent"
        android:layout_marginTop="20dp"
        android:layout_height="64dp"
        android:text="开始采集"
        android:textSize="25sp"/>

</LinearLayout>
```

弄一个线性布局就ok了。

大概是这个样子：

![YV25xP.png](https://s1.ax1x.com/2020/05/07/YV25xP.png)



### 实现获取传感器信息

手机里有跟多传感器。包括什么，重力、加速、陀螺仪、温度等等。

#### 使用方式

根据我们使用传感器的套路。

1. 先获得传感器管理器。

   ```java
   SensorManager sm = (SensorManager)getSystemService(SENSOR_SERVICE); 
   ```

2. 获得设备传感器对象列表。

   ```java
   List<Sensor> allSensors = sm.getSensorList(Sensor.TYPE_ALL);
   ```

3. 选择具体的传感器。

   ```java
   for(Sensor s:allSensors){
       sensor.getName();   //获得传感器名称
       sensor.getType();     //获得传感器种类
       sensor.getVendor();    //获得传感器供应商
       sensor.getVersion();    //获得传感器版本
       sensor.getResolution();  //获得精度值
       sensor.getMaximumRange(); //获得最大范围
       sensor.getPower();        //传感器使用时的耗电量 
   }
   ```

因为我只需要使用到加速度传感器，所以根据我们使用特定传感器的方式，我们这样：

1. 获得传感器管理器

   ```java
   SensorManager sm = (SensorManager)getSystemService(SENSOR_SERVICE); 
   ```

2. 调用特定方法获得需要的传感器

   ```java
   Sensor mSensorOrientation = sm.getDefaultSensor(Sensor.TYPE_ORIENTATION);
   ```

3. 实现监听

   ```java
   @Override
   public void onSensorChanged(SensorEvent event) {
       final float[] _Data = event.values;
      this.mService.onSensorChanged(_Data[0],_Data[1],_Data[2]);
   }
   @Override
   public void onAccuracyChanged(Sensor sensor, int accuracy) {
   }
   ```

4. 注册监听

   ```java
   // 上下文对象，传感器对象，传感器延时精度
   ms.registerListener(mContext, mSensorOrientation, android.hardware.SensorManager.SENSOR_DELAY_UI);
   ```

5. 取消监听

   ```java
   ms.registerListener(mContext, mSensorOrientation, android.hardware.SensorManager.SENSOR_DELAY_UI);
   ```
   

这样的话，我们一步一步来。

#### 先搞个初始化传感器函数

```java
private void initSensor() {
    // 得到传感器管理器
    sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
    // 获取特定的传感器
    mSensorAccelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
}
```

再重写实现我们的传感器改变的时候的函数，当然在此之前，我们还需要让我们这个`MainActivity`实现我们的`SensorEventListener`接口

```java
public class MainActivity extends AppCompatActivity implements SensorEventListener
```



```java
@Override
public void onSensorChanged(SensorEvent event) {
    // 传感器的值发送变化时的回调函数 event 包含 一个float[] 的values.
    float[] values = event.values;
    if (flag == true) {
        // 显示数据
        tv_result.setText("X(red)：" + values[0] + "\n" + "Y(green)：" + values[1] + "\n" + "Z(blue)：" + values[2]);
        // 存储数据
        saveSensorData(getSensorData(values));
        // 绘制x、y、z
        try {
            mCanvas = mSvHolder.lockCanvas();
            if (mCanvas != null) {
                mPaint.setColor(Color.RED);
                mCanvas.drawPoint(x, (int) (120 + values[0]), mPaint);
                mPaint.setColor(Color.GREEN);
                mCanvas.drawPoint(x, (int) (240 + values[1]), mPaint);
                mPaint.setColor(Color.BLUE);
                mCanvas.drawPoint(x, (int) (360 + values[2]), mPaint);
                x++;
                if (x > mScreenWidth) {
                    x = 0;
                    mCanvas.drawColor(Color.BLACK);

                }
                mSvHolder.unlockCanvasAndPost(mCanvas);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (mCanvas != null) {
                mSvHolder.lockCanvas(new Rect(0, 0, 0, 0));
                mSvHolder.unlockCanvasAndPost(mCanvas);
            }
        }
    }
}

@Override
public void onAccuracyChanged(Sensor sensor, int accuracy) {
    // 传感器精度发生变化时的回调
}
```

#### 监听

我们在  onResume() 的时候进行传感器的监听，并在销毁时进行取消监听。

```java
@Override
protected void onResume() {
    super.onResume();
    sensorManager.registerListener(this, mSensorAccelerometer, 	SensorManager.SENSOR_DELAY_NORMAL);
}

@Override
protected void onDestroy() {
    super.onDestroy();
    sensorManager.unregisterListener(this);
}
```

### 控件绑定事件

其实我就一个按钮好像有点儿事件。

实现一下点击事件。先实现这个`View.OnClickListener` 接口

```java
public class MainActivity extends AppCompatActivity implements View.OnClickListener
```

写个函数搞到控件再监听按钮的点击事件

```java
private void bindViews() {
    tv_result = (TextView) findViewById(R.id.tv_result);
    btn_start = (Button) findViewById(R.id.btn_start);
    sv_result = (SurfaceView) findViewById(R.id.sv_result);
    mSvHolder = sv_result.getHolder();
    mSvHolder.addCallback(new handelHolder());
    // 画笔
    mPaint = new Paint();
    // 画笔粗细
    mPaint.setStrokeWidth(2.0f);
    // 设备宽度
    mDisplay = getWindowManager().getDefaultDisplay();
    moutsize = new Point();
    mDisplay.getSize(moutsize);
    mScreenWidth = moutsize.x;
    // 按钮监听
    btn_start.setOnClickListener(this);
}
```

重写我们的点击事件

```java
@Override
public void onClick(View view) {
    if (flag == true) {
        btn_start.setText("开始采集");
        if (!mSensordataArrayList.isEmpty()) {
        for (SensorData sensorData : mSensordataArrayList) {
        //Log.i("datalist", ":" + sensorData);
    }
    	requestPost(mSensordataArrayList);
    }
    	flag = false;
    } else {
        btn_start.setText("结束采集");
        flag = true;
    }
}
```

### 然后我们用一下Canvas 和 Paint

用以下我们的画布跟画笔，绘制我们的传感器数据的x、y、z 的数据点线

主要是在传感器信息发生改变的时候，绘制我们的数据点，同时在绘制完一个屏幕宽度的时候将画布清空。

绘制之前我们需要搞到数据，跟拿到屏幕宽度。

#### 获取屏幕宽度

```java
// 设备宽度
mDisplay = getWindowManager().getDefaultDisplay();
moutsize = new Point();
mDisplay.getSize(moutsize);
mScreenWidth = moutsize.x;
```

#### 在传感器数据变化时绘制

```java
// 绘制x、y、z
try {
    // 锁定我们的画布
    mCanvas = mSvHolder.lockCanvas();
    if (mCanvas != null) {
        // 给画笔设置颜色
        mPaint.setColor(Color.RED);
        // 绘制数据
        mCanvas.drawPoint(x, (int) (120 + values[0]), mPaint);
        mPaint.setColor(Color.GREEN);
        mCanvas.drawPoint(x, (int) (240 + values[1]), mPaint);
        mPaint.setColor(Color.BLUE);
        mCanvas.drawPoint(x, (int) (360 + values[2]), mPaint);
      	// x轴移动
        x++;
        // 判断屏幕宽度
        if (x > mScreenWidth) {
            x = 0;
            mCanvas.drawColor(Color.BLACK);
        }
        // 解锁绘制显示出来
    	mSvHolder.unlockCanvasAndPost(mCanvas);
    }
} catch (Exception e) {
	e.printStackTrace();
} finally {
    if (mCanvas != null) {
        mSvHolder.lockCanvas(new Rect(0, 0, 0, 0));
        mSvHolder.unlockCanvasAndPost(mCanvas);
    }
}
```

### 传递我们的传感器数据到服务

使用HTTP将收集到的数据发送到后端服务器上。

我们将进行数据的封装、Post发送。后续估计要将数据存储到文件里再上传了。

#### 数据封装

```java
// 实现我们的SensorData类
package com.zeez.rev.models;

/**
 * author：霁
 * time：2020/5/6
 * description
 */
public class SensorData {
    private double mX;
    private double mY;
    private double mZ;

    public double getmX() {
        return mX;
    }

    public void setmX(double mX) {
        this.mX = mX;
    }

    public double getmY() {
        return mY;
    }

    public void setmY(double mY) {
        this.mY = mY;
    }

    public double getmZ() {
        return mZ;
    }

    public void setmZ(double mZ) {
        this.mZ = mZ;
    }

    public SensorData(double mX, double mY, double mZ) {
        this.mX = mX;
        this.mY = mY;
        this.mZ = mZ;
    }

    public SensorData() {
    }

    @Override
    public String toString() {
        return "SensorData{" +
                "mX=" + mX +
                ", mY=" + mY +
                ", mZ=" + mZ +
                '}';
    }
}
```

#### 搞到动态数组里在发送

```java
// 声明个变量保存一下
private ArrayList<SensorData> mSensordataArrayList = new ArrayList<SensorData>();
// 搞到数据
private SensorData getSensorData(float[] values) {
    SensorData sensorData = new SensorData(values[0], values[1], values[2]);
    return sensorData;
}
// 存储到数组里
private void saveSensorData(SensorData sensorData) {
    if (flag == true) {
        mSensordataArrayList.add(sensorData);
    }
}
// 当然，在传感器数据改变时调用上述存储函数。把数据都搞到一起先。
```

#### 新建线程进行Post数据

不能在主线程进行网络请求，需要开辟一个新线程。

```java
/***
* post
*/
private void requestPost(final ArrayList<SensorData> sensorData) {
    new Thread(new Runnable() {
        @Override
        public void run() {
            try {
                // 由于127.0.0.1不可以在真机等模拟的时候访问到
                // 我们需要搞到我们的网络ip地址（使用同一个wifi）
                String baseurl = "http://192.168.1.5:5556/sensor";
                // body参数
                String param = "sensor="+ sensorData;
                // 构造url
                URL url = new URL(baseurl);
                // 打开连接对象
                HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
                // 指定请求方式为POST
                httpURLConnection.setRequestMethod("POST");
                Log.i("url",":"+url);
                // 开始连接
                httpURLConnection.connect();
                // 发送数据
                PrintWriter printWriter = new PrintWriter(httpURLConnection.getOutputStream());
                printWriter.write(param);
                printWriter.flush();
                printWriter.close();
                // 获取结果
                int resultCode = httpURLConnection.getResponseCode();
                if (HttpURLConnection.HTTP_OK == resultCode){
                    StringBuffer sb=new StringBuffer();
                    String readLine=new String();
                    BufferedReader responseReader=new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream(),"UTF-8"));
                    while((readLine=responseReader.readLine())!=null){
                        sb.append(readLine).append("\n");
                    }
                    responseReader.close();
                    Log.i("response",":"+sb.toString());
                }

            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }).start();
}
```

#### 解决连接问题

首先看好请求地址的设置。

还遇到了好像因为 Android Pie后面什么http请求权限的问题（不允许出现http，需要https）

我们需要在`AndroidManifest.xml` 里设置一下

1. 先声明需要网络请求的权限

   ```xml
   <!-- 声明网络请求权限   -->
   <uses-permission android:name="android.permission.INTERNET"/>
   ```

2. application 里指定

   ```xml
   android:usesCleartextTraffic="true"
   ```

   最后我们可以进行数据发送！唉，真是伟大的会晤（搞了半天）。

![YV2bVg.png](https://s1.ax1x.com/2020/05/07/YV2bVg.png)

### 最后

附上半成品程序：

#### MainActivity.java

```java
// MainActivity.java
package com.zeez.rev;

import androidx.appcompat.app.AppCompatActivity;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.Rect;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.util.Log;
import android.view.Display;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.zeez.rev.models.SensorData;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;


public class MainActivity extends AppCompatActivity implements SensorEventListener, View.OnClickListener {

    private SensorManager sensorManager;
    private Sensor mSensorAccelerometer;
    private TextView tv_result;
    private Button btn_start;
    private boolean flag = false;
    private SurfaceView sv_result = null;
    private Paint mPaint = null;
    private SurfaceHolder mSvHolder = null;
    private int x = 0;
    private Display mDisplay;
    private int mScreenWidth;
    private Point moutsize;
    private Canvas mCanvas;

    private ArrayList<SensorData> mSensordataArrayList = new ArrayList<SensorData>();


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        bindViews();
        initSensor();
    }

    private void initSensor() {
        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        mSensorAccelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
    }

    private void bindViews() {
        tv_result = (TextView) findViewById(R.id.tv_result);
        btn_start = (Button) findViewById(R.id.btn_start);
        sv_result = (SurfaceView) findViewById(R.id.sv_result);
        mSvHolder = sv_result.getHolder();
        mSvHolder.addCallback(new handelHolder());
        // 画笔
        mPaint = new Paint();
        // 画笔粗细
        mPaint.setStrokeWidth(2.0f);
        // 设备宽度
        mDisplay = getWindowManager().getDefaultDisplay();
        moutsize = new Point();
        mDisplay.getSize(moutsize);
        mScreenWidth = moutsize.x;
        // 按钮监听
        btn_start.setOnClickListener(this);
    }

    private SensorData getSensorData(float[] values) {
        SensorData sensorData = new SensorData(values[0], values[1], values[2]);
        return sensorData;
    }

    /**
     * get
     */
    private void requestGet() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                //
            }
        }).start();
    }

    /***
     * post
     */
    private void requestPost(final ArrayList<SensorData> sensorData) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String baseurl = "http://192.168.1.5:5556/sensor";
                    String param = "sensor="+ sensorData;
                    URL url = new URL(baseurl);
                    HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
                    httpURLConnection.setRequestMethod("POST");
                    Log.i("url",":"+url);
                    httpURLConnection.connect();
                    PrintWriter printWriter = new PrintWriter(httpURLConnection.getOutputStream());
                    printWriter.write(param);
                    printWriter.flush();
                    printWriter.close();
                    int resultCode = httpURLConnection.getResponseCode();
                    if (HttpURLConnection.HTTP_OK == resultCode){
                        StringBuffer sb=new StringBuffer();
                        String readLine=new String();
                        BufferedReader responseReader=new BufferedReader(new InputStreamReader(httpURLConnection.getInputStream(),"UTF-8"));
                        while((readLine=responseReader.readLine())!=null){
                            sb.append(readLine).append("\n");
                        }
                        responseReader.close();
                        Log.i("response",":"+sb.toString());
                    }

                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        }).start();
    }

    private void saveSensorData(SensorData sensorData) {
        if (flag == true) {
            mSensordataArrayList.add(sensorData);
//            Log.i("sensordata","s："+sensorData);
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        float[] values = event.values;
        if (flag == true) {
            // 显示数据
            tv_result.setText("X(red)：" + values[0] + "\n" + "Y(green)：" + values[1] + "\n" + "Z(blue)：" + values[2]);
            // 存储数据
            saveSensorData(getSensorData(values));
            // 绘制x、y、z
            try {
                mCanvas = mSvHolder.lockCanvas();
                if (mCanvas != null) {
                    mPaint.setColor(Color.RED);
                    mCanvas.drawPoint(x, (int) (120 + values[0]), mPaint);
                    mPaint.setColor(Color.GREEN);
                    mCanvas.drawPoint(x, (int) (240 + values[1]), mPaint);
                    mPaint.setColor(Color.BLUE);
                    mCanvas.drawPoint(x, (int) (360 + values[2]), mPaint);
                    x++;
                    if (x > mScreenWidth) {
                        x = 0;
                        mCanvas.drawColor(Color.BLACK);

                    }
                    mSvHolder.unlockCanvasAndPost(mCanvas);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (mCanvas != null) {
                    mSvHolder.lockCanvas(new Rect(0, 0, 0, 0));
                    mSvHolder.unlockCanvasAndPost(mCanvas);
                }
            }
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }

    @Override
    public void onClick(View view) {
        if (flag == true) {
            btn_start.setText("开始采集");
            if (!mSensordataArrayList.isEmpty()) {
                for (SensorData sensorData : mSensordataArrayList) {
//                    Log.i("datalist", ":" + sensorData);
                }
                requestPost(mSensordataArrayList);
            }
            flag = false;
        } else {
            btn_start.setText("结束采集");
            flag = true;
        }
    }


    @Override
    protected void onResume() {
        super.onResume();
        sensorManager.registerListener(this, mSensorAccelerometer, SensorManager.SENSOR_DELAY_NORMAL);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        sensorManager.unregisterListener(this);
    }


    private class handelHolder implements SurfaceHolder.Callback {

        @Override
        public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

        }

        @Override
        public void surfaceCreated(SurfaceHolder holder) {

        }

        @Override
        public void surfaceDestroyed(SurfaceHolder holder) {

        }
    }

}

```

#### 总结

以上纯属回顾学习内容，只好再三提醒自己，真 的 很 菜 。勉勉强强就想混个毕业这样。