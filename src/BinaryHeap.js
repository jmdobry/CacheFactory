/**
 * @private
 * @param {array} heap The heap.
 * @param {function} weightFunc The weight function.
 * @param {number} n The index of the element to bubble up.
 */
const bubbleUp = function (heap, weightFunc, n) {
  const element = heap[n]
  const weight = weightFunc(element)
  // When at 0, an element can not go up any further.
  while (n > 0) {
    // Compute the parent element's index, and fetch it.
    let parentN = Math.floor((n + 1) / 2) - 1
    let parent = heap[parentN]
    // If the parent has a lesser weight, things are in order and we
    // are done.
    if (weight >= weightFunc(parent)) {
      break
    } else {
      heap[parentN] = element
      heap[n] = parent
      n = parentN
    }
  }
}

/**
 * @private
 * @param {array} heap The heap.
 * @param {function} weightFunc The weight function.
 * @param {number} n The index of the element to sink down.
 */
const bubbleDown = function (heap, weightFunc, n) {
  var length = heap.length
  let node = heap[n]
  let nodeWeight = weightFunc(node)

  while (true) {
    let child2N = (n + 1) * 2
    let child1N = child2N - 1
    let swap = null
    if (child1N < length) {
      let child1 = heap[child1N]
      let child1Weight = weightFunc(child1)
      // If the score is less than our node's, we need to swap.
      if (child1Weight < nodeWeight) {
        swap = child1N
      }
    }
    // Do the same checks for the other child.
    if (child2N < length) {
      let child2 = heap[child2N]
      let child2Weight = weightFunc(child2)
      if (child2Weight < (swap === null ? nodeWeight : weightFunc(heap[child1N]))) {
        swap = child2N
      }
    }

    if (swap === null) {
      break
    } else {
      heap[n] = heap[swap]
      heap[swap] = node
      n = swap
    }
  }
}

/**
 * @class BinaryHeap
 * @example
 * import { BinaryHeap } from 'cachefactory';
 *
 * const queue = new BinaryHeap();
 * queue.push(2);
 * queue.push(77);
 * queue.push(8);
 * queue.push(33);
 * queue.push(5);
 * queue.pop(); // 2
 * queue.pop(); // 5
 * queue.pop(); // 8
 * queue.pop(); // 33
 * queue.pop(); // 77
 *
 * const userQueue = new BinaryHeap(
 *   (user) => user.age,
 *   (userOne, userTwo) => userOne.id === userTwo.id
 * );
 * queue.push({ id: 1, age: 34 });
 * queue.push({ id: 2, age: 29 });
 * queue.push({ id: 3, age: 25 });
 * queue.push({ id: 3, age: 28 });
 * queue.push({ id: 3, age: 27 });
 * queue.push({ id: 4, age: 42 });
 * queue.push({ id: 5, age: 19 });
 * queue.pop(); // { id: 5, age: 19 }
 * queue.pop(); // { id: 3, age: 27 }
 * queue.pop(); // { id: 2, age: 29 }
 * queue.pop(); // { id: 1, age: 34 }
 * queue.pop(); // { id: 4, age: 42 }
 *
 * @param {function} [weightFunc] See {@link BinaryHeap#weightFunc}.
 * @param {function} [compareFunc] See {@link BinaryHeap#compareFunc}.
 */
export default class BinaryHeap {
  constructor (weightFunc, compareFunc) {
    if (!weightFunc) {
      weightFunc = (x) => x
    }
    if (!compareFunc) {
      compareFunc = (x, y) => x === y
    }
    if (typeof weightFunc !== 'function') {
      throw new Error('BinaryHeap([weightFunc][, compareFunc]): "weightFunc" must be a function!')
    }
    if (typeof compareFunc !== 'function') {
      throw new Error('BinaryHeap([weightFunc][, compareFunc]): "compareFunc" must be a function!')
    }

    /**
     * The heap's configured weight function.
     *
     * Default:
     * ```js
     * function (x) {
     *   return x;
     * }
     * ```
     *
     * @name BinaryHeap#weightFunc
     * @type {function}
     */
    this.weightFunc = weightFunc

    /**
     * The heap's configured compare function.
     *
     * Default:
     * ```js
     * function (x, y) {
     *   return x === y;
     * }
     * ```
     *
     * @name BinaryHeap#compareFunc
     * @type {function}
     */
    this.compareFunc = compareFunc

    /**
     * The heap's data.
     *
     * @name BinaryHeap#heap
     * @type {Array<*>}
     */
    this.heap = []
  }

  /**
   * Push an item into the queue.
   *
   * @method BinaryHeap#push
   * @param {*} node
   */
  push (node) {
    this.heap.push(node)
    bubbleUp(this.heap, this.weightFunc, this.heap.length - 1)
  }

  /**
   * Look at the item at the front of the queue.
   *
   * @method BinaryHeap#peek
   * @returns {*}
   */
  peek () {
    return this.heap[0]
  }

  /**
   * Pop an item off the front of the queue.
   *
   * @method BinaryHeap#pop
   * @returns {*}
   */
  pop () {
    const front = this.heap[0]
    const end = this.heap.pop()
    if (this.heap.length > 0) {
      this.heap[0] = end
      bubbleDown(this.heap, this.weightFunc, 0)
    }
    return front
  }

  /**
   * Remove the given item from the queue.
   *
   * @method BinaryHeap#remove
   * @param {*} node
   */
  remove (node) {
    const length = this.heap.length
    for (let i = 0; i < length; i++) {
      if (this.compareFunc(this.heap[i], node)) {
        let removed = this.heap[i]
        let end = this.heap.pop()
        if (i !== length - 1) {
          this.heap[i] = end
          bubbleUp(this.heap, this.weightFunc, i)
          bubbleDown(this.heap, this.weightFunc, i)
        }
        return removed
      }
    }
    return null
  }

  /**
   * Clear the heap.
   *
   * @method BinaryHeap#removeAll
   */
  removeAll () {
    this.heap = []
  }

  /**
   * Return the length of the queue.
   *
   * @method BinaryHeap#size
   * @returns {number}
   */
  size () {
    return this.heap.length
  }
}
