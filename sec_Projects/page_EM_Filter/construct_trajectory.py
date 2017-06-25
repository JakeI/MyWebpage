import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as ani
import matplotlib.patches as mpatches

import trajectory

def main():

    big = True
    save = True

    tr = trajectory.trajectory()
    if big:
        fig, (ax) = plt.subplots(1, 1, figsize=(50/7,5))
    else:
        fig, (ax) = plt.subplots(1, 1, figsize=(10,3))

    if big:
        tr.ux = 5*tr.v
    else:
        tr.ux = 0

    t = np.linspace(0, np.abs(4*np.pi/tr.w), 400)
    x = tr.x(t)
    y = tr.y(t)

    R = (tr.ux-tr.v)/tr.w
    r = tr.v/tr.w

    big_circle = mpatches.Circle((0, R), R, facecolor=(1,1,1), edgecolor=(0,0,0), linewidth=2)
    circle = mpatches.Circle((0, R), r, facecolor=(1,1,1), edgecolor=(0,0,0), linewidth=2)

    line, = ax.plot([], [], '-', linewidth=2, color=(1, 140/256, 0))
    prediction, = ax.plot(x, y, '-', linewidth=2, color=(0.3, 0.3, 0.3))
    surface, = ax.plot(tr.v*t, (R+r)*np.ones_like(t), 'k--')
    center, = ax.plot(tr.v*t, R*np.ones_like(t), 'k:')
    pointer, = ax.plot([0,0], [R, 0], 'o-', linewidth=2, color=(1, 80/256, 0))

    ax.ticklabel_format(style='sci', axis='x', scilimits=(-3,3), useMathText=True)
    ax.ticklabel_format(style='sci', axis='y', scilimits=(-3,3), useMathText=True)

    xh, yh = 0.05*(np.max(x)-np.min(x)), 0.05*(np.max(y)-np.min(y))
    ax.set(xlim=[np.min(x)-xh, np.max(x)+xh], ylim=[np.min(y)-yh, np.max(y)+yh], aspect=1)
    #ax.set_aspect('equal', 'datalim')
    #if big:
    #    ax.set_ylim(0e-5, -1.5e-5)
    #else:
    #    ax.set_xlim(np.min(x)+0.15*(np.max(x)-np.min(x)), np.max(x)-0.15*(np.max(x)-np.min(x)))

    ax.add_patch(big_circle)
    ax.add_patch(circle)

    ax.set_title("$t \\in [ %ss; %ss ], \\; u_x = %s\\frac{m}{s}$" % \
        (trajectory.trajectory.get_str(np.min(t)),
        trajectory.trajectory.get_str(np.max(t)),
        trajectory.trajectory.get_str(tr.ux)))
    ax.set_xlabel("$x(t), \\; m$")
    ax.set_ylabel("$y(t), \\; m$")

    plt.tight_layout()

    def animate(i):

        line.set_xdata(x[:int(i)])
        line.set_ydata(y[:int(i)])

        prediction.set_xdata(x[int(i):])
        prediction.set_ydata(y[int(i):])

        circle.center = (tr.v*t[int(i)], R)
        big_circle.center = (tr.v*t[int(i)], R)
        pointer.set_xdata([tr.v*t[int(i)], tr.v*t[int(i)] + R*np.sin(tr.w*t[int(i)])])
        pointer.set_ydata([R, R*(1-np.cos(tr.w*t[int(i)]))])
        return circle, pointer, big_circle, line, prediction

    animation = ani.FuncAnimation(fig, animate, np.linspace(0, 399, 399), interval=25, blit=False)

    if save:
        if big:
            animation.save('construct_trajectory-trocoide.mp4', fps=30, extra_args=['-vcodec', 'libx264'])
        else:
            animation.save('construct_trajectory-cycloide.mp4', fps=30, extra_args=['-vcodec', 'libx264'])

    plt.show()

if __name__ == "__main__":
    main()
