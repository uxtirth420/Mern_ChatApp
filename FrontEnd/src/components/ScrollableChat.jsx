import React from 'react'
import ScrollFeed from './miscellaneous/ScrollFeed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from './config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
import { Tooltip, Avatar, Menu, IconButton } from '@chakra-ui/react'
import { FiClock } from 'react-icons/fi';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { MdDeleteOutline } from 'react-icons/md';

const formatMessageTime = (date) => {
    if (!date) return '';

    return new Intl.DateTimeFormat([], {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
};

const isSameDay = (firstDate, secondDate) => {
    const first = new Date(firstDate);
    const second = new Date(secondDate);

    return first.getFullYear() === second.getFullYear()
        && first.getMonth() === second.getMonth()
        && first.getDate() === second.getDate();
};

const formatDateLabel = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(messageDate, today)) return 'Today';
    if (isSameDay(messageDate, yesterday)) return 'Yesterday';

    return new Intl.DateTimeFormat([], {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(messageDate);
};

const isMessageRead = (message) => {
    return message.readBy?.some((readerId) => {
        const id = String(readerId?._id || readerId);
        return id !== String(message.sender?._id);
    });
};

const ScrollableChat = ({ messages, onDeleteMessage }) => {
    const { user } = ChatState();
    const [hoveredMessageId, setHoveredMessageId] = React.useState(null);

    return (
        <ScrollFeed style={{ paddingBottom: "6px" }}>
            {messages &&
                messages.map((m, i) => {
                    const shouldShowDate = i === 0 || !isSameDay(m.createdAt, messages[i - 1].createdAt);

                    return (
                    <React.Fragment key={m._id}>
                    {shouldShowDate && m.createdAt && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                width: "100%",
                                margin: "18px 0 8px",
                                color: "#718096",
                                fontSize: "12px",
                            }}
                        >
                            <div style={{ flex: 1, height: "1px", backgroundColor: "#CBD5E0" }} />
                            <span
                                style={{
                                    padding: "5px 10px",
                                    borderRadius: "6px",
                                    backgroundColor: "#E2E8F0",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {formatDateLabel(m.createdAt)}
                            </span>
                            <div style={{ flex: 1, height: "1px", backgroundColor: "#CBD5E0" }} />
                        </div>
                    )}
                    <div
                        style={{
                            display: "flex",
                            alignSelf: m.sender._id === user?._id ? "flex-end" : "flex-start",
                            width: "100%",
                            justifyContent: m.sender._id === user?._id ? "flex-end" : "flex-start",
                        }}
                        onMouseEnter={() => setHoveredMessageId(m._id)}
                        onMouseLeave={() => setHoveredMessageId(null)}
                    >
                        {(isSameSender(messages, m, i, user?._id) ||
                            isLastMessage(messages, i, user?._id)) && (
                            <Tooltip.Root positioning={{ placement: "bottom-start" }}>
                                <Tooltip.Trigger asChild>
                                    <Avatar.Root size="sm" cursor="pointer" mr="1" mt="7px">
                                        <Avatar.Fallback name={m.sender.name} />
                                        <Avatar.Image src={m.sender.pic} />
                                    </Avatar.Root>
                                </Tooltip.Trigger>
                                <Tooltip.Positioner>
                                    <Tooltip.Content>
                                        <Tooltip.Arrow>
                                            <Tooltip.ArrowTip />
                                        </Tooltip.Arrow>
                                        {m.sender.name}
                                    </Tooltip.Content>
                                </Tooltip.Positioner>
                            </Tooltip.Root>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", position: "relative" }}>
                            <span
                                style={{
                                    backgroundColor: `${
                                        m.sender._id === user?._id ? "#BEE3F8" : "#B9F5D0"
                                    }`,
                                    marginLeft: isSameSenderMargin(messages, m, i, user?._id),
                                    marginTop: isSameUser(messages, m, i, user?._id) ? 3 : 10,
                                    borderRadius: "20px",
                                    padding: "5px 15px",
                                    maxWidth: "75%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <span>{m.content}</span>
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        alignSelf: "flex-end",
                                        gap: "3px",
                                        marginTop: "3px",
                                        fontSize: "11px",
                                        lineHeight: 1,
                                        color: m.sender._id === user?._id ? "#4A5568" : "#276749",
                                    }}
                                >
                                    {m.sender._id === user?._id ? (
                                        <IoCheckmarkDoneSharp
                                            size={14}
                                            aria-label={isMessageRead(m) ? "Read" : "Sent"}
                                            color={isMessageRead(m) ? "#34B7F1" : "#718096"}
                                        />
                                    ) : (
                                        <FiClock size={11} aria-hidden="true" />
                                    )}
                                    {formatMessageTime(m.createdAt)}
                                </span>
                            </span>
                            {m.sender._id === user?._id && onDeleteMessage && (
                                <Menu.Root positioning={{ placement: "bottom-end" }}>
                                    <Menu.Trigger asChild>
                                        <IconButton
                                            aria-label="Open message options"
                                            size="xs"
                                            variant="ghost"
                                            colorPalette="red"
                                            onClick={(event) => event.stopPropagation()}
                                            style={{
                                                marginTop: isSameUser(messages, m, i, user?._id) ? 3 : 10,
                                                opacity: hoveredMessageId === m._id ? 1 : 0,
                                                visibility: hoveredMessageId === m._id ? "visible" : "hidden",
                                                pointerEvents: hoveredMessageId === m._id ? "auto" : "none",
                                                transition: "opacity 0.15s ease, visibility 0.15s ease",
                                            }}
                                        >
                                            <MdDeleteOutline size={14} />
                                        </IconButton>
                                    </Menu.Trigger>
                                    <Menu.Positioner>
                                        <Menu.Content >
                                            <Menu.Item colorPalette="red" onClick={() => onDeleteMessage(m._id)} _hover={{ cursor: 'pointer' }} cursor="pointer">
                                                Delete message
                                            </Menu.Item>
                                        </Menu.Content>
                                    </Menu.Positioner>
                                </Menu.Root>
                            )}
                        </div>
                    </div>
                    </React.Fragment>
                    );
                })}
        </ScrollFeed>
    )
}

export default ScrollableChat