# Linear Regression using Gradient Descent

| Square Foot $(x)$ | Price $(y)$   |
| ----------------- | ------------- |
| 1260 $x^{(0)}$    | 190 $y^{(0)}$ |
| 2800 $x^{(1)}$    | 230 $y^{(1)}$ |
| 3778 $x^{(2)}$    | 350 $y^{(2)}$ |
| 6380 $x^{(3)}$    | 438 $y^{(3)}$ |
| 5257 $x^{(4)}$    | 323 $y^{(4)}$ |
| 8080 $x^{(5)}$    | 510 $y^{(5)}$ |

#### Hypothesis

$$
h_\theta(x) = \theta_0 + \theta_1(x)
$$

#### Initial Guess

Let $\theta_0$ = 1 and $\theta_1$ = 0 (Blue Scatters)

# <img src="C:\Users\320035675\AppData\Roaming\Typora\typora-user-images\image-20200730203437081.png" alt="image-20200730203437081" style="zoom:150%;" />



## Gradient Descent

$$
\text{Mean Squared Error} = \frac{1}{m} \sum_{i=1}^m \big(\text{Guess}_i - \text{Actual}_i \big)^2
\\[4ex]
\text{Cost Function: } J(\theta) = \frac{1}{m} \sum_{i=1}^m \big(h_\theta(x^{(i)}) - y^{(i)} \big)^2
$$

- The lower the MSE, the better
- MSE is never likely to be zero, it means perfect fit



#### Computing MSE

- For $\theta_0 = 1$

$$
\begin{align}
\text{Mean Squared Error} &= \frac{(1-190)^2 + (1-230)^2 + (1-350)^2 + (1-438)^2 + (1-323)^2 + (1-510)^2}{6} \\[2ex]
&= \frac{35721 + 52441 + 121801 + 190969 + 103684 + 259081}{6} \\[2ex]
&= \frac{763,697}{6} \\[2ex]
&= 127,282.83333
\end{align}
$$

- For $\theta_0 = 190$

$$
\begin{align}
\text{Mean Squared Error} &= \frac{(190-190)^2 + (190-230)^2 + (190-350)^2 + (190-438)^2 + (190-323)^2 + (190-510)^2}{6} \\[2ex]
&= \frac{0 + 1600 + 25600 + 61504 + 17689 + 102400}{6} \\[2ex]
&= \frac{208,793}{6} \\[2ex]
&= 34,798.8333
\end{align}
$$



Why can't we just try out different values of $\theta_0$ and find the lowest MSE?

- We don't know the possible range of $\theta_0$
- We don't know the step size for incrementing $\theta_0$
- Computational demand will be huge when adding more features

```
for(i=190;i<510;i++) {
	for(j=190;j<510;j++) {
		for(k=190;k<510;k++) {
			...
			\\ Calculate MSE
		}
	}
}
```

The above code fragment resolves to $O(n^3)$ complexity, which is tremendous.



#### MSE vs Weight

![image-20200730231511382](C:\Users\320035675\AppData\Roaming\Typora\typora-user-images\image-20200730231511382.png)

Observation from this plot:

- Slope is high for a terrible value of MSE
- Slope becomes flat near the valley where MSE value is the lowest
- Direction of the slope tells us where the optimal value of MSE is



#### Making an Educated Guess

An educated guess for the optimal value of $\theta$ can be made if:

- Value of MSE is known at any given location
- Slope is known at that location



#### Slope Equation

$$
\begin{align}
\min_\theta \text(MSE) &= \frac{2}{m} \sum_{i=0}^m \big(\text{Guess}_i - \text{Actual}_i \big) \\[3ex]
\min_\theta J(\theta) &= \frac{2}{m} \sum_{i=0}^m \big(h_\theta(x^{(i)}) - y^{(i)} \big) \\[3ex]
\frac{d}{d\theta_0} J(\theta_0, \theta_1) &= \frac{2}{m} \sum_{i=0}^m \big((\theta_0 - \theta_1x^{(i)}) - y^{(i)}\big) \\[3ex]
\frac{d}{d\theta_1} J(\theta_0, \theta_1) &= \frac{2}{m} \sum_{i=0}^m \big((\theta_0 - \theta_1x^{(i)}) - y^{(i)}\big) \times (x^{(i)}) \\[3ex]
\end{align}
$$



#### Learning Rate

![image-20200730232722661](C:\Users\320035675\AppData\Roaming\Typora\typora-user-images\image-20200730232722661.png)