#

import numpy as np
import matplotlib.pyplot as plt

import trajectory

def main():
    tr = trajectory.trajectory()
    fig, (ax, bx, cx) = plt.subplots(3, 1, figsize=(6,8))

    for ux, axx in zip([0, 1, 5], [ax, bx, cx]):
        tr.ux = ux*tr.v
        axxt = axx.twinx()
        tr.plot_vx(axxt)
        tr.alpha_time(axx)
        #tr.plot(0, np.abs(2*np.pi/tr.w), axx.twinx(), False)

    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    main()
