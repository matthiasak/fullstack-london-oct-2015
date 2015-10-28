const time = (fn) => {
    let d = +new Date
    fn()
    log(`${~~(+new Date - d)}ms`)
}

const qs = (s, el) => (el || document).querySelector(s)
const loadScripts = (...urls) => Promise.all(
    urls.map(url => {
        let s = document.createElement('script')
        s.src = url
        document.body.appendChild(s)
        return new Promise((res,rej) => s.onload = res)
    })
)

window.onload = loadScripts('https://cdnjs.cloudflare.com/ajax/libs/mori/0.3.2/mori.min.js').then(() => init()).catch(e => log(e))

const init = () => {
    // immutable - Efficient immutable data structures - no cloning required
    // Uniform iteration for all types (iterate over objects or arrays / vectors or maps)
    // Value based equality (n=1 checking of equality)
    // Persistence - rollback an object to older values

    // data types
    // list (like an array, but no intrinsic order
    let l = mori.list(1,2,3)
    // log(l)

    // vector (like an array)
    let v = mori.vector(1,2,3)
    // log(v)

    // hash-map / sorted-map
    let m = mori.map(1,2,3)
    // log(m)

    // set / sorted-set
    // let s = mori.set(1,2,3)
    //log(s)

    // create two new objects, they are "equal" because they have an intrisically same value (a "hash")
    // hence the "value based equality"
    var a = mori.list(1,2,3)
    var b = mori.vector(1,2,3)

    // mori likes hashes, a lot. it creates
    // hashes as numbers
    log(mori.hash(a), mori.hash(b))

    // mori.equals() computes these hashes and compares them
    log(mori.equals(a,b))

    // mori can compare different types, too
    let c = mori.vector(1,2,3)
    log(mori.equals(v, a))

    // toClj turns a JS object into a mori structure
    // {} -> maps
    // [] -> vectors
    var d = mori.toClj({foo: 1})
    var e = mori.toClj({foo: 1})
    log(mori.equals(d,e))

    // more on types and testing for types
    // Test if something is a list-like collection.
    // Lists support efficient adding to the head.
    log(mori.isList(a))
    // Test if something is a sequence (i.e. iterable)
    log(mori.isSeq(e))
    log(mori.isSeq(a))
    log(mori.isSeq(b))

    // Test if something is a vector-like collection.
    // Vectors support random access. It is efficient
    // to add to the end of a vector.
    log(mori.isVector(a))
    log(mori.isVector(b))

    // there's also:
    // - mori.isMap(coll)
    // Test if something is a map-like collection.
    // Maps support random access and arbitrary keys.
    //
    // - mori.isSet(coll)
    // Test if something is a hash set.
    //
    // - mori.isCollection(coll)
    // Test if something is a collection -
    // lists, maps, sets, vectors are all collections.
    // - mori.isSequential(coll)
    // Test if something is sequential. For example vectors
    // are sequential but are not sequences. They can however
    // be converted into something iterable by calling seq on them.
    // - mori.isAssociative(coll)
    // Test if something is associative - i.e. vectors and maps.
    // - mori.isCounted(coll)
    // Test if something can give its count in O(1) time.
    // - mori.isIndexed(coll)
    // Test if something is indexed - i.e. vectors.
    // - mori.isReduceable(coll)
    // Test if something is reduceable.
    // - mori.isSeqable(coll)
    // Test if something can be coerced into something iterable.
    // - mori.isReversible(coll)
    // Test if something can be reversed in O(1) time.


}