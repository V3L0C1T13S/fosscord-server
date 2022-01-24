import { PrimaryColumn, Column, Entity} from "typeorm";
import { BaseClassWithoutId } from "./BaseClass";

// TODO: categories:
// [{
// 	"id": 16,
// 	"default": "Anime & Manga",
// 	"localizations": {
// 			"de": "Anime & Manga",
// 			"fr": "Anim\u00e9s et mangas",
// 			"ru": "\u0410\u043d\u0438\u043c\u0435 \u0438 \u043c\u0430\u043d\u0433\u0430"
// 		}
// 	},
// 	"is_primary": false/true
// }]

@Entity("categories")
export class CategoryEntity extends BaseClassWithoutId { // Not using snowflake
    
    @PrimaryColumn()
	id: number;

    @Column()
    default: string;

    @Column({ type: "simple-json", nullable: false })
    localizations: string;

    @Column()
    is_primary: boolean;

}