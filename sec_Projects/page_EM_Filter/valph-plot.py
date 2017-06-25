#
# Checked if electrons happend to move with bar{v} when moving horizontally because this could
# explain why the filter works. But it turns out, they aren't

import numpy as np
import matplotlib.pyplot as plt

import trajectory

def main():
    tr = trajectory.trajectory()
    fig, (ax, bx, cx) = plt.subplots(3, 1, figsize=(6,8))

    tr.ux = 0
    tr.valpha(ax)
    tr.ux = 1.000000001*tr.v
    tr.valpha(bx)
    tr.ux = 5*tr.v
    tr.valpha(cx)

    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    main()
