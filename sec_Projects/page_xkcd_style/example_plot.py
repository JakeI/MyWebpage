import numpy as np
import matplotlib.pyplot as plt

t = np.linspace(0, 4.2, 100)
y = t**2

plt.xkcd()
plt.plot(t, y, color=(1.0, 140/255, 0), linewidth=3)

plt.title("Me: running short distnace")
plt.xlabel("time in years")
plt.ylabel("distance in nano meters")

plt.show()
