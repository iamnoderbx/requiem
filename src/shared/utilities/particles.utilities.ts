export namespace ParticleUtilities {
    export const emit = (attachment : Attachment) => {
        attachment.GetDescendants().forEach((descendant) => {
            if(!descendant.IsA("ParticleEmitter")) return;

            const amount = (descendant.GetAttribute("EmitCount") as number) || 1
            descendant.Emit(amount)
        })
    }
}