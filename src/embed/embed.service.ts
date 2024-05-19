import { Injectable } from '@nestjs/common';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { GuildQueue, Track, useQueue } from 'discord-player';

@Injectable()
export class EmbedService {
  public currentTrack(track: Track): EmbedBuilder {
    return (
      new EmbedBuilder()
        .setColor(0x6ea2d5)
        .setTitle('Сейчас играет: ')
        .setDescription(
          `${track.source !== 'arbitrary' ? track.toHyperlink() : track.title.replace(/\.[^/.]+$/, '')}\n\n⏲Длительность: ${track.duration}`,
        )
        // .setAuthor(author)
        .setThumbnail(track.source === 'youtube' ? null : track.thumbnail)
        .setImage(track.source === 'youtube' ? track.thumbnail : null)
    );
  }

  public queue(track: Track, interaction: ChatInputCommandInteraction) {
    const queue: GuildQueue | null = useQueue(interaction.guild?.id as string);
    return (
      new EmbedBuilder()
        .setColor(0x0f996b)
        .setTitle(
          track.source !== 'arbitrary'
            ? track.title
            : track.title.replace(/\.[^/.]+$/, ''),
        )
        .setURL(track.source !== 'arbitrary' ? track.url : null)
        // .setAuthor(author)
        .setDescription(`Добавлен в очередь (${track.duration})`)
        .addFields({
          name: 'Треков в очереди: ',
          value: `${queue?.tracks.toArray().length}`,
        })
        .setFooter({
          text: `Добавил: ${interaction.user.displayName}`,
          iconURL: interaction.user.avatarURL() as string,
        })
    );
  }

  public queueList(queueList: Track[]): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(0xf1f1f1)
      .setTitle('Список очереди:')
      .setDescription(
        queueList
          .map((track: Track) =>
            track.source !== 'arbitrary'
              ? track.title
              : track.title.replace(/\.[^/.]+$/, ''),
          )
          .join('\n'),
      );
    // .setAuthor(author);
  }

  public error(error: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(0xe32636)
      .setTitle('Произошла ошибка😓')
      .setDescription(error);
  }

  public info(title: string, text?: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(0xf1f1f1)
      .setTitle(title)
      .setDescription(text ? text : null);
    // .setAuthor(author);
  }
}
