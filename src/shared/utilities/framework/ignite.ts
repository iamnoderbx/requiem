export default function(path : Instance) {
    path.GetDescendants().forEach((descendant) => {
        if(!descendant.IsA("ModuleScript")) return

        debug.profilebegin("Ignite: " + descendant.GetFullName())
        require(descendant)
        debug.profileend()
    })
}