import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as ani

import trajectory

def main():
    tr = trajectory.trajectory()
    fig, (ax) = plt.subplots(1, 1, figsize=(10,5))

    data = tr.alpha_time(ax, mode="create", data=(0, 1.2e-10, -180, 180))
    axt = ax.twinx()
    datavx = tr.plot_vx(axt, mode="create", data=(0, 5e5))
    plt.tight_layout()

    def animate(i):
        tr.ux = i
        tr.alpha_time(ax, mode="update", data=data)
        tr.plot_vx(axt, mode="update", data=datavx)
        left_line_1, left_line2 = data["left_line"]
        right_line_1, right_line_2 = data["right_line"]
        return data["line"], left_line_1, left_line2, right_line_1, right_line_2, \
                data["text"], data["right_dot"], data["left_dot"], datavx["line"]

    animation = ani.FuncAnimation(fig, animate, np.linspace(0, 5*tr.v, 400), interval=25, blit=False)

    animation.save('alpha_time_ani.mp4', fps=30, extra_args=['-vcodec', 'libx264'])

    plt.show()

if __name__ == "__main__":
    main()
