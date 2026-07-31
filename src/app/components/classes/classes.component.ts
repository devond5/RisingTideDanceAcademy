import { Component, inject, OnInit } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { SiteDataService } from '../../services/site-data-service.service';
import { AgeGroup, AgeGroupClasses, BaseStyleInfo, BaseStyles, Class, StyleGroup } from '../../types/class-schedule-teacher-tuition.type';
import { combineLatest, filter } from 'rxjs';
@Component({
  selector: 'app-classes',
  imports: [PanelModule],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss',
})
export class ClassesComponent implements OnInit {
  private siteDataService = inject(SiteDataService);
  classes: Class[] = [];
  baseStyles: BaseStyleInfo[] = [];
  formattedClasses: StyleGroup[] | undefined;

  ngOnInit(): void {
    combineLatest([this.siteDataService.baseStyles, this.siteDataService.classes])
      .pipe(filter(([val1, val2]) => val1.length > 0 && val2.length > 0))
      .subscribe(([baseStyles, classes]) => {
        this.baseStyles = baseStyles;
        this.classes = classes;
        this.groupClassesByStyleAndAge();
      });
  }

  groupClassesByStyleAndAge(): void {
    if (this.classes && this.baseStyles) {
      // Map<BaseStyle, Map<AgeGroup, Class[]>>
      const styleMap = new Map<BaseStyles, Map<AgeGroup, Class[]>>();

      this.baseStyles.forEach(style => {
        styleMap.set(style.name, new Map<AgeGroup, Class[]>());
      });

      // 1. Group classes into nested Maps
      for (const item of this.classes) {
        const styleKey = item.baseStyle;
        const ageKey = AgeGroup[item.ageGroup as keyof typeof AgeGroup];

        if (!styleMap.has(styleKey)) {
          styleMap.set(styleKey, new Map());
        }

        const ageMap = styleMap.get(styleKey)!;
        if (!ageMap.has(ageKey)) {
          ageMap.set(ageKey, []);
        }

        ageMap.get(ageKey)!.push(item);
      }

      // 2. Transform nested Maps into the desired array output
      const result: StyleGroup[] = [];

      styleMap.forEach((ageMap, styleName) => {
        const ageGroups: AgeGroupClasses[] = [];

        ageMap.forEach((classList, ageGroupName) => {
          ageGroups.push({
            ageGroupName,
            classes: classList,
          });
        });

        result.push({
          name: styleName,
          description: this.baseStyles.find(style => style.name === styleName)?.description || '',
          attire: this.baseStyles.find(style => style.name === styleName)?.attire || '',
          ageGroups,
        });
      });

      this.formattedClasses = result;
    }
  }

  //   classDescriptions = [
  //   {
  //     name: 'Ballet',
  //     description: 'The beautiful foundation of all dance. Our ballet program focuses on building grace, discipline, and core strength while fostering a deep appreciation for classical technique. Perfect for dancers looking to refine their form and achieve effortless movement.',
  //     ageGroups: [
  //       {
  //         groupName: 'First Steps (Ages 18 Months-2 )',
  //         groupDescription: 'A gentle, caregiver-assisted introduction to movement, music, and spatial awareness.',
  //         classes: [
  //           {
  //             className: 'Come Dance With Me Ballet',
  //             details: 'Toddlers will develop gross motor skills and basic rhythm through imaginative play, props, and guided movement with their caregiver.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Pre Dance (Ages 3-4)',
  //         groupDescription: 'Fostering independence, early musicality, and foundational ballet shapes.',
  //         classes: [
  //           {
  //             className: 'Pre-Ballet',
  //             details: 'A magical introduction to the world of dance! Dancers will explore creative movement, basic ballet terminology, and rhythm in a fun, imaginative environment.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Rising Dancer (Ages 5-7)',
  //         groupDescription: 'Transitioning from creative movement to structured studio etiquette and classical technique.',
  //         classes: [
  //           {
  //             className: 'Ballet I',
  //             details: 'Focuses on foundational barre work, center floor exercises, and proper alignment. Dancers will learn to execute classical positions with confidence and poise.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Dance Maker (Ages 8-10)',
  //         groupDescription: 'Building core strength, flexibility, and a deeper understanding of ballet vocabulary.',
  //         classes: [
  //           {
  //             className: 'Ballet II',
  //             details: 'Expands on foundational techniques with more complex combinations, balance exercises, and introductory turns. Emphasis is placed on discipline and form.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Ensemble (Ages 11-13)',
  //         groupDescription: 'Focusing on intermediate center work, leaps, and classical artistry.',
  //         classes: [
  //           {
  //             className: 'Ballet III',
  //             details: 'Challenges dancers with intricate adagio and allegro combinations. Students will focus on musicality, extension, and fluid transitions.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Artist in Motion (Ages 14+)',
  //         groupDescription: 'Advanced classical training designed for high-level execution and pre-pointe/pointe preparation.',
  //         classes: [
  //           {
  //             className: 'Ballet IV/V',
  //             details: 'An advanced technique class requiring deep focus. Dancers will work on multiple pirouettes, grand allegro, and refined artistic expression.'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Hip Hop',
  //     description: 'High-energy, rhythmic, and incredibly fun! Our hip hop classes teach the latest street styles, popping, locking, and commercial choreography. Dancers will build stamina, musicality, and their own unique swagger.',
  //     ageGroups: [
  //       {
  //         groupName: 'First Steps (Ages 18 Months-2 )',
  //         groupDescription: 'Upbeat and bouncy movement to get toddlers grooving to the beat.',
  //         classes: [
  //           {
  //             className: 'Toddler Bop',
  //             details: 'An energetic, caregiver-assisted class focusing on bouncing, clapping, and moving safely to fun, family-friendly hip hop beats.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Pre Dance (Ages 3-4)',
  //         groupDescription: 'Introduction to rhythm, weight transfer, and expressing energy through dance.',
  //         classes: [
  //           {
  //             className: 'Mini Movers',
  //             details: 'A high-energy class where preschoolers learn to find the beat, jump, and practice basic body isolations while playing rhythm games.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Rising Dancer (Ages 5-7)',
  //         groupDescription: 'Learning fundamental grooves and age-appropriate street styles.',
  //         classes: [
  //           {
  //             className: 'Hip Hop I',
  //             details: 'Breaks down fundamental grooves, body isolations, and standard hip hop terminology. Great for building confidence and finding the beat.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Dance Maker (Ages 8-10)',
  //         groupDescription: 'Developing coordination, dynamic energy, and introductory choreography retention.',
  //         classes: [
  //           {
  //             className: 'Hip Hop II',
  //             details: 'Students will learn multi-step combinations, basic popping and locking, and how to add their own personal flavor to the movement.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Ensemble (Ages 11-13)',
  //         groupDescription: 'Diving into intricate commercial choreography and performance quality.',
  //         classes: [
  //           {
  //             className: 'Hip Hop III',
  //             details: 'Focuses on faster tempos, sharp textural changes in movement, and developing a strong stage presence. Freestyle elements are frequently introduced.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Artist in Motion (Ages 14+)',
  //         groupDescription: 'Advanced street styles and demanding, high-energy combinations.',
  //         classes: [
  //           {
  //             className: 'Hip Hop IV/V',
  //             details: 'A rigorous class featuring complex commercial choreography, floorwork, and advanced musicality training designed to push a dancer’s stamina.'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Contemporary, Lyrical, & Modern',
  //     description: 'Fluid, emotional, and boundless. This style blends the strong technique of ballet with the floorwork and freedom of modern dance. Dancers will learn to connect their movements to music and tell a story through choreography.',
  //     ageGroups: [
  //       {
  //         groupName: 'First Steps (Ages 18 Months-2 )',
  //         groupDescription: 'Exploring spatial awareness and emotion through gentle movement.',
  //         classes: [
  //           {
  //             className: 'Creative Movement',
  //             details: 'Caregivers and toddlers explore levels (high and low), sweeping movements, and imaginative prompts using scarves and soft music.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Pre Dance (Ages 3-4)',
  //         groupDescription: 'Connecting simple movements to musical cues and storytelling.',
  //         classes: [
  //           {
  //             className: 'Intro to Expression',
  //             details: 'Preschoolers will learn to stretch, sway, and leap, using their bodies to express different feelings and tell simple stories through dance.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Rising Dancer (Ages 5-7)',
  //         groupDescription: 'Introduction to lyrical foundations, blending basic ballet technique with fluid movement.',
  //         classes: [
  //           {
  //             className: 'Contemporary/Lyrical I',
  //             details: 'Introduces basic floorwork, fall and recovery techniques, and expressive movement. A ballet or jazz background is helpful but not required.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Dance Maker (Ages 8-10)',
  //         groupDescription: 'Developing modern techniques, off-balance work, and emotional connection.',
  //         classes: [
  //           {
  //             className: 'Contemporary II',
  //             details: 'Dancers will explore contract and release techniques, weight sharing, and traveling smoothly across the floor while interpreting musical lyrics.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Ensemble (Ages 11-13)',
  //         groupDescription: 'Focusing on complex floor transitions and improvisational exercises.',
  //         classes: [
  //           {
  //             className: 'Contemporary III',
  //             details: 'Challenges dancers with emotionally driven choreography, advanced floorwork, and developing their own unique movement pathways.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Artist in Motion (Ages 14+)',
  //         groupDescription: 'Advanced artistry requiring deep technical control and vulnerability.',
  //         classes: [
  //           {
  //             className: 'Contemporary IV/V',
  //             details: 'Explores advanced modern techniques (Graham, Horton), intricate partner work, and highly stylized, athletic contemporary choreography.'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Jazz',
  //     description: 'Dynamic, sharp, and theatrical! Jazz classes focus on flexibility, leaps, turns, and stylized movements. From classic Broadway to upbeat commercial jazz, dancers will develop incredible stamina and stage presence.',
  //     ageGroups: [
  //       {
  //         groupName: 'First Steps (Ages 18 Months-2 )',
  //         groupDescription: 'An upbeat introduction to big, bold movements.',
  //         classes: [
  //           {
  //             className: 'Jazz Babies',
  //             details: 'A lively, caregiver-assisted class focusing on marching, clapping, and energetic motor skill development to fun, upbeat music.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Pre Dance (Ages 3-4)',
  //         groupDescription: 'Learning to isolate movements, jump, and groove with confidence.',
  //         classes: [
  //           {
  //             className: 'Pre-Jazz',
  //             details: 'Dancers will learn basic jazz hands, toe touches, and lively traveling steps in a structured, high-energy environment.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Rising Dancer (Ages 5-7)',
  //         groupDescription: 'Building basic jazz technique, center work, and traveling progressions.',
  //         classes: [
  //           {
  //             className: 'Jazz I',
  //             details: 'Covers essential jazz walks, kicks (battements), basic turns, and upbeat center combinations to build flexibility and rhythm.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Dance Maker (Ages 8-10)',
  //         groupDescription: 'Developing coordination for multiple turns, leaps, and stylization.',
  //         classes: [
  //           {
  //             className: 'Jazz II',
  //             details: 'Focuses on traveling progressions, single and double pirouettes, and intricate syncopated rhythms used in Broadway and commercial styles.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Ensemble (Ages 11-13)',
  //         groupDescription: 'Focusing on power, flexibility, and advanced center floor combinations.',
  //         classes: [
  //           {
  //             className: 'Jazz III',
  //             details: 'Dancers will tackle complex leap combinations, fouetté turns, and stylized choreography requiring strong core control and stamina.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Artist in Motion (Ages 14+)',
  //         groupDescription: 'High-level commercial and theatrical jazz execution.',
  //         classes: [
  //           {
  //             className: 'Jazz IV/V',
  //             details: 'An advanced class requiring elite technical skill. Focuses on professional-level audition combos, explosive jumps, and dynamic performance quality.'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Tap',
  //     description: 'Make music with your feet! Our tap program at Rising Tide teaches rhythm, timing, and percussive footwork. Dancers will develop a sharp ear for musicality while building ankle strength and quick coordination.',
  //     ageGroups: [
  //       {
  //         groupName: 'First Steps (Ages 18 Months-2 )',
  //         groupDescription: 'Discovering sound making and rhythmic stomping.',
  //         classes: [
  //           {
  //             className: 'Tiny Tappers',
  //             details: 'A caregiver-assisted class where toddlers explore making noise with their feet, clapping to a beat, and basic weight transfer.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Pre Dance (Ages 3-4)',
  //         groupDescription: 'Introduction to basic tap terminology and isolating foot parts.',
  //         classes: [
  //           {
  //             className: 'Pre-Tap',
  //             details: 'Preschoolers will learn the difference between toe and heel drops, basic shuffles, and how to create clear sounds to musical counts.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Rising Dancer (Ages 5-7)',
  //         groupDescription: 'Building clear, articulate sounds and foundational tap combinations.',
  //         classes: [
  //           {
  //             className: 'Tap I',
  //             details: 'Covers essential tap steps including flaps, shuffles, ball-changes, and basic time steps. Dancers learn to count music and stay on beat.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Dance Maker (Ages 8-10)',
  //         groupDescription: 'Increasing speed, clarity, and introducing syncopated rhythms.',
  //         classes: [
  //           {
  //             className: 'Tap II',
  //             details: 'Focuses on multi-sound steps, traveling across the floor, and understanding the difference between Broadway and rhythm tap styles.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Ensemble (Ages 11-13)',
  //         groupDescription: 'Complex rhythmic patterning and intricate footwork.',
  //         classes: [
  //           {
  //             className: 'Tap III',
  //             details: 'Dancers will master advanced time steps, drawbacks, and pullbacks while focusing on executing sounds clearly at fast tempos.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Artist in Motion (Ages 14+)',
  //         groupDescription: 'Advanced a cappella tap and complex rhythmic composition.',
  //         classes: [
  //           {
  //             className: 'Tap IV/V',
  //             details: 'A challenging class featuring intricate polyrhythms, advanced turning steps, and highly stylized percussive choreography.'
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Choreography & Composition',
  //     description: 'Step into the role of the creator. This program explores the elements of dance composition, spatial awareness, and musicality, giving students the tools to craft their own routines and understand the architecture of dance.',
  //     ageGroups: [
  //       {
  //         groupName: 'Dance Maker (Ages 8-10)',
  //         groupDescription: 'An introduction to the building blocks of making dances.',
  //         classes: [
  //           {
  //             className: 'Intro to Choreography',
  //             details: 'Students will learn how to string 8-counts together, use different spatial levels, and explore guided improvisation games to spark creativity.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Ensemble (Ages 11-13)',
  //         groupDescription: 'Understanding formations, transitions, and choreographic intent.',
  //         classes: [
  //           {
  //             className: 'Composition I',
  //             details: 'Dancers will study how to structure a complete piece, manipulate movement motifs, and effectively utilize staging and group formations.'
  //           }
  //         ]
  //       },
  //       {
  //         groupName: 'Artist in Motion (Ages 14+)',
  //         groupDescription: 'Advanced choreographic concepts, peer collaboration, and critique.',
  //         classes: [
  //           {
  //             className: 'Composition II',
  //             details: 'A deep dive into choreographic devices and intent. Students will choreograph on their peers, analyze professional works, and develop their own unique choreographic voice.'
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ];
}
