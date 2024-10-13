import { system, ItemStack, EnchantmentType } from "@minecraft/server"

system.afterEvents.scriptEventReceive.subscribe(ev => {
    if(ev.id == "advancedgive:item") give_item(ev.sourceEntity, ev.message)
})

function give_item(source, Message) {
    try {
        const message = Message.toLowerCase()
        const commandArray = message.split(`;`)
        let typeId = ""
        let amount = 1
        commandArray.forEach(command => {
            if(command.slice(0,7) == "typeid=") typeId = command.slice(7)
            else if(command.slice(0,7) == "amount=") amount = command.slice(7)
        })
        const item = new ItemStack(typeId, amount*1)
        commandArray.forEach(command => {
            if(command.slice(0,11) == "keepondeath") item.keepOnDeath = true
            else if(command.slice(0,9) == "lockmode=") item.lockMode = command.slice(9)
            else if(command.slice(0,8) == "nametag=") item.nameTag = command.slice(8)
            else if(command.slice(0,7) == "damage=") item.getComponent("durability").damage = command.slice(7)*1
            else if(command.slice(0,11) == "candestroy=") item.setCanDestroy(command.slice(11).slice(1,-1).split(","))
            else if(command.slice(0,11) == "canplaceon=") item.setCanPlaceOn(command.slice(11).slice(1,-1).split(","))
            else if(command.slice(0,5) == "lore=") item.setLore(command.slice(5).slice(1,-1).split(","))
            else if(command.slice(0,8) == "enchant=") {
                command.slice(8).slice(1,-1).split("}").forEach(enchant => {
                    const eArray = enchant.slice(1).split(",")
                    if(!(eArray.length == 2)) return
                    const type = eArray[0]
                    const level = eArray[1]
                    item.getComponent("enchantable").addEnchantment({type: new EnchantmentType(type), level: level*1})
                })
            }
        })
        const { container } = source.getComponent("inventory")
        container.addItem(item)
    } catch(error) {
            source.sendMessage(`§c構文エラー:\n ${error}`)
    }
}
//  /scriptevent advancedgive:item typeid=netherreactor;amount=90;keepondeath;lockmode=inventory;nametag=謎のコア;canplaceon=[diamond_block,gold_block];lore=[§gUnique,Soulbound];
//  /scriptevent advancedgive:item lore=[§dEpic];typeid=netherite_pickaxe;nametag=古代のツルハシ;damage=1500;candestroy=[glowingobsidian];enchant=[{mending,1}{efficiency,5}]