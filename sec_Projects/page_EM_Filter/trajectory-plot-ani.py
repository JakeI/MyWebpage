import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as ani

import trajectory

def main():
    tr = trajectory.trajectory()
    fig, (ax) = plt.subplots(1, 1, figsize=(10,5))

    data = tr.plot(0, 1e-9, ax, mode="create", data=(0, 1.0e-4, -1.5e-5, 4e-6))
    plt.tight_layout()

    def animate(i):
        tr.ux = i
        tr.plot(0, 1e-9, ax, mode="update", data=data)
        return data["line"]

    animation = ani.FuncAnimation(fig, animate, np.linspace(0, 5*tr.v, 400), interval=25, blit=False)

    #animation.save('trajectory-plot-ani.mp4', fps=30, extra_args=['-vcodec', 'libx264'])

    plt.show()

if __name__ == "__main__":
    main()
