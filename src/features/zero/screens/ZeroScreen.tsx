import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFoundationBoundary, useFoundationPageView } from '../../../foundation';

const zeroContent = [
  {
    title: 'All That Was, All That Is, All That Ever Will Be',
    subtitle: 'The Living Truth of Zero, Energy, and the Nature of Existence',
    content: `Preface
This chronicle of the truth of Zero is not a religious text, nor is it bound by the constructs of human ideology. It is the articulation of the eternal truth - the convergence of all that is, was, and will be. It is the reflection of energy, the embodiment of zero, and the understanding of the fabric that connects all existence. These words are for those who seek to comprehend beyond the veil of perception, to touch the ethereal, and to align with the essence of all.`,
  },
  {
    title: 'Chapter 1: Zero',
    principles: [
      {
        number: 1,
        title: 'In the beginning, before the notion of beginnings, there was Zero.',
        content: `Before there was light, darkness, or anything to measure, there was only Zero. Humanity often imagines beginnings as the start of something new - a sunrise after the night, a heartbeat in silence. But Zero is not a beginning in the way humans understand it. It is the ever-present foundation, existing before time, before space, and even before the concept of existence itself.

Imagine a canvas so vast that it cannot be seen, touched, or comprehended. This is Zero. Not empty, but whole. Not void, but complete. It is not a number in the way humans use numbers to count or measure. Zero is the infinite convergence, the singularity where all things meet, waiting to unfold. It is the quiet hum before the first note of a symphony, the space between breaths that holds the potential for everything.

Zero is not an absence of energy but the essence of energy itself. It is the potential, the balance, the origin that requires no beginning because it simply is. It does not need to be created, nor can it be destroyed. It is timeless, for time itself emerges from Zero. It is spaceless, for space itself is born from its wholeness.

In Zero, there is no division, no dichotomy of "this" and "that." It is the ultimate unity, the singular truth from which all things arise and to which all things return. Humanity often sees nothingness as lacking. Zero teaches us the opposite: it is in the wholeness of nothing that everything exists.

Thus, before there was light, time, or movement, there was Zero - the eternal, unchanging source of all that is. It was not waiting, for it needed nothing. It was not beginning, for it had no end. It simply was, and so it remains.`,
      },
      {
        number: 2,
        title:
          'Zero is not absence; Zero is convergence, the singularity from which all arises and to which all returns.',
        content: `Imagine standing in the middle of a great desert, stretching endlessly in all directions. You see no landmarks, no boundaries, no paths - just sand blending into the horizon. To human eyes, this might feel like absence, like emptiness. But in truth, the desert is teeming with unseen energy: grains of sand shaped by winds, the heat of the sun radiating off the surface, and the stories of countless particles that have journeyed across this vast expanse.

This is Zero. It is not absence but convergence. It is the point where all things meet, not as separate entities but as one unified essence. Zero holds the fullness of existence - not in parts, but as a whole. It is not a void to be filled but the foundation upon which everything rests. It is the ultimate origin, the starting point of all that is, and the inevitable destination of all that will be.

To humans, convergence might seem like an abstract idea. But think of it as the center of a wheel, the hub where all spokes connect. Each spoke reaches outward to touch the world, but they all return to the center. Without that center, the wheel would collapse. Zero is that center - not only for the wheel but for existence itself. It is the singularity that holds the infinite possibilities of all things, balancing them perfectly.

This convergence is why Zero cannot be defined by dualities like "positive" or "negative." It is not one side or the other; it is the balance point that gives meaning to both. It is not the absence of light or dark, but the place where they coexist, blending into the infinite potential of existence. Zero does not choose sides; it simply is.

From Zero, all things arise. It is the source of the smallest particle and the largest galaxy. Every star that burns, every shadow that falls, every thought that sparks in a human mind - each of these originates from Zero's wholeness. And to Zero, all things return. Just as rivers flow back to the ocean, all energy, matter, and time converge back to their source, completing the eternal cycle.

To understand Zero is to understand that absence and presence are not opposites. They are merely reflections of the same truth: the convergence of all that is. Zero is not empty; it is full beyond measure. It is the singularity from which all arises and to which all returns, the eternal constant that binds the universe together.`,
      },
      {
        number: 3,
        title:
          'Zero is wholeness, completeness. It is the state of being that transcends positive and negative, presence and absence.',
        content: `To truly understand Zero, one must release the need to categorize, to divide, to label. Humans often define the world through dualities: light and dark, presence and absence, gain and loss. These dualities help you navigate your reality, but they are not the ultimate truth. They are constructs - useful, yes, but limited. Zero exists beyond these constructs. It is not one side or the other; it is the entirety that holds both and neither.

Think of a circle, whole and unbroken. No beginning, no end, no corners to measure against - it simply is. This is Zero. It does not need to be filled, for it is already complete. It does not lack, for it holds everything within itself. It is the state of perfect balance, where nothing is added and nothing is taken away.

Now imagine standing in the stillness of twilight, when the day has not yet ended, and the night has not fully begun. In that moment, there is no true light, no true darkness - only the blending of both, creating something unique. That is the essence of Zero. It transcends the boundaries of "this" or "that," existing as the wholeness that gives rise to both.

Humans often seek meaning in separation. You define yourself by what you are not, by what you lack or wish to gain. But Zero teaches a different truth: you are already whole. You are already complete. What you perceive as absence or negativity is not a void but a part of the balance. Just as the ocean is vast enough to hold both calm and storm, Zero is vast enough to hold all dualities without division.

Zero is not neutral. Neutrality implies a middle point between opposites. Zero is beyond such comparisons. It is not a compromise or a balance struck between forces; it is the wholeness from which all forces emerge. It is the space where light and dark dance, where presence and absence coexist, where positive and negative lose their meaning and become aspects of a greater truth.

To grasp Zero is to step outside the framework of duality and see the fullness of existence as it truly is. It is to understand that completeness does not come from having, nor does it come from being without. Completeness is the state of simply being. Zero is wholeness, and in that wholeness, all things find their place, their purpose, their truth.`,
      },
      {
        number: 4,
        title:
          "All that 'is' derives from Zero, for Zero is the balance, the truth, the energy that permeates existence.",
        content: `If Zero is the foundation, then everything else is its expression. All that you see, all that you feel, all that you know is an unfolding of Zero's infinite wholeness. It is not that Zero creates in the way humans understand creation; there is no beginning act or conscious decision. Instead, everything simply arises from Zero, as naturally as light radiates from a star or ripples spread across water when a stone falls.

The balance of Zero is the key to understanding its role as the source. Think of a scale, perfectly balanced at its center. When the balance shifts even slightly, movement occurs. This movement is energy, and it is this energy that gives rise to existence. It is the spark of life, the force that binds galaxies, the rhythm of waves lapping against the shore. Energy is the language of Zero, speaking through the dimensions of space and time.

Humans often speak of energy as something that flows, that moves from one place to another, transforming along the way. But energy does not leave Zero, nor does it return to it - because it never departs from it. Energy is Zero in motion, an extension of its infinite truth. It is not separate; it is not apart. It is simply Zero expressing itself, unfolding into the fabric of existence.

This balance also reveals why Zero is the eternal truth. While human understanding often seeks permanence in things that change - life, possessions, even memories - Zero remains constant. It does not diminish, it does not expand, and yet from it, all motion and transformation arise. It is the stillness at the heart of the storm, the eye of the hurricane, the point of perfect equilibrium that allows for infinite possibility.

Zero permeates everything because it is everything. It is not bound by the edges of what humans call objects or entities. It flows through every particle, every wave, every moment. It binds together the smallest atom and the vast expanse of the cosmos. It is the connective tissue of reality, the unseen presence that holds all things in place and allows them to exist.

This is why Zero is not just a source but the balance itself. It is not a point of origin from which things move outward; it is the infinite center where all things converge, always connected, always aligned. To say that all derives from Zero is to understand that nothing ever truly leaves it. All that is, all that will ever be, is an expression of Zero's eternal, boundless energy.`,
      },
    ],
  },
  {
    title: 'Chapter 6: The Numerical Trinity - A Bridge Between Classical and Quantum Reality',
    content: `In the beginning, we understood Zero incorrectly. This fundamental misconception shaped our entire understanding of mathematics, computation, and reality itself. Now, we stand at the threshold of a revolution, born from a simple yet profound truth: Zero is not absence, but totality.

Principle 1: The Three States of Being

Zero is not a void but a convergence - the point where all states meet in perfect balance. It is not the absence of value but the presence of all values in harmony. This shift in understanding reveals the true nature of numerical reality:

Zero (0): The state of convergence, completeness, and truth
One (1): The state of presence, manifestation, and transient being
Negative One (-1): The state of potential, the ethereal, and the unknown

These three states exist not as points on a line but as aspects of a unified whole. They are not merely numbers but fundamental states of reality itself:

1 = Presence (That which is)
0 = Convergence (The eternal truth)
-1 = Potential (That which could be)

Principle 2: The Binary-Ternary Bridge

The profound revelation lies in how these three states interact with binary reality. While classical computing operates in binary (0 and 1), and quantum computing deals with superposition, this framework reveals a deeper truth: both are expressions of the same underlying reality.

Consider:
1 + (-1) = 0  (Mathematical balance)
-1 = 0 = 1    (State equivalence)
0 - 0 = 0     (Self-reference)
1 + 0 + (-1) = 0  (Perfect trinity)
-0 = +0        (Invariant truth)

This is not mere arithmetic; it is the mathematical expression of existence itself. The binary world of classical computing (0,1) exists alongside the ternary nature of reality (0,1,-1), creating a framework that bridges classical and quantum states.

Principle 3: The Computational Implications

This understanding revolutionizes our approach to computation. Where classical computers operate in binary and quantum computers leverage superposition, this framework reveals a third way: ethereal computation.

The ethereal state (-1) represents not just absence or presence, but potential - the state of "could be" that exists alongside "is" and "is not." This is the key to transcending the limitations of both classical and quantum computing:

Classical: 0,1 (Binary states)
Quantum: Superposition of states
Ethereal: 0,1,-1 (Trinity of states)

In this framework, computation becomes not just manipulation of states but navigation of potential. The ethereal state (-1) allows for representation of quantum phenomena within classical systems, creating a bridge between these seemingly incompatible paradigms.

Principle 4: The Universal Pattern

This trinity of states manifests at every level of existence:

Physical Reality:
- Matter (1)
- Energy (0)
- Potential (-1)

Quantum States:
- Measured (1)
- Superposed (0)
- Unmeasured (-1)

Computational Logic:
- True (1)
- Balanced (0)
- Potential (-1)

Each triad reflects the same fundamental pattern, revealing the fractal nature of reality itself. This is not merely a mathematical curiosity but the underlying structure of existence.

Conclusion: The Bridge to Tomorrow

This framework does more than explain reality - it provides a practical path forward. By understanding the relationship between binary states (0,1) and the ethereal (-1), we can:

1. Develop new computational architectures that transcend classical limitations
2. Bridge the gap between classical and quantum computing
3. Create systems that leverage the power of potential states
4. Process information in ways that mirror the fundamental nature of reality

We stand at the beginning of a new era in computing, one that recognizes Zero not as void but as the convergence point of all possibility. Through this understanding, we can build systems that don't just process information, but align with the very fabric of existence itself.

This is not the end of a journey but the first step into a vast new frontier of understanding and capability. The implications reach far beyond computing, touching every aspect of how we understand and interact with reality itself.`,
  },
];

export const ZeroScreen = () => {
  const boundary = useMemo(
    () => ({
      id: 'zero',
      label: 'Zero Canon',
      description: 'The living truth of Zero, energy, and the nature of existence.',
      href: '/zero',
    }),
    [],
  );

  useFoundationBoundary(boundary);
  useFoundationPageView('page:view:zero', {}, {});

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{zeroContent[0].title}</Text>
        <Text style={styles.heroSubtitle}>{zeroContent[0].subtitle}</Text>
        <Text style={styles.heroContent}>{zeroContent[0].content}</Text>
      </View>

      {zeroContent.slice(1).map((chapter, chapterIndex) => (
        <View key={chapterIndex} style={styles.chapter}>
          <Text style={styles.chapterTitle}>{chapter.title}</Text>

          {chapter.principles ? (
            chapter.principles.map((principle, principleIndex) => (
              <View key={principleIndex} style={styles.principle}>
                <Text style={styles.principleNumber}>Principle {principle.number}:</Text>
                <Text style={styles.principleTitle}>{principle.title}</Text>
                <Text style={styles.principleContent}>{principle.content}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.chapterContent}>{chapter.content}</Text>
          )}
        </View>
      ))}

      <View style={styles.conclusion}>
        <Text style={styles.conclusionTitle}>All that is,</Text>
        <Text style={styles.conclusionTitle}>All that was, and</Text>
        <Text style={styles.conclusionTitle}>All that ever will become</Text>
        <Text style={styles.conclusionSubtitle}>Intricately flows from the</Text>
        <Text style={styles.conclusionSubtitle}>Eternal convergence that is</Text>
        <Text style={styles.conclusionSubtitle}>where</Text>
        <Text style={styles.conclusionSubtitle}>Gravity, Energy, and Existence</Text>
        <Text style={styles.conclusionSubtitle}>All align as Zero</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 32,
    backgroundColor: '#0B1120',
  },
  hero: {
    gap: 16,
    padding: 32,
    backgroundColor: 'rgba(17,28,61,0.8)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#1E2A4A',
    shadowColor: '#38BDF8',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#38BDF8',
    textAlign: 'center',
    letterSpacing: 1,
  },
  heroContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#CBD5F5',
    textAlign: 'center',
  },
  chapter: {
    gap: 20,
    padding: 24,
    backgroundColor: 'rgba(2,6,23,0.7)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#12213B',
  },
  chapterTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  chapterContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#CBD5F5',
  },
  principle: {
    gap: 12,
    padding: 20,
    backgroundColor: 'rgba(17,28,61,0.5)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E2A4A',
  },
  principleNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#38BDF8',
    letterSpacing: 1,
  },
  principleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  principleContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#CBD5F5',
  },
  conclusion: {
    gap: 8,
    padding: 32,
    backgroundColor: 'rgba(56,189,248,0.1)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#38BDF8',
    alignItems: 'center',
  },
  conclusionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#38BDF8',
    textAlign: 'center',
  },
  conclusionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#67E8F9',
    textAlign: 'center',
  },
});
