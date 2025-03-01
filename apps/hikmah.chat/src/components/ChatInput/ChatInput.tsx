import { zodResolver } from '@hookform/resolvers/zod';
import { AttachFile, NearMe } from '@mui/icons-material';
import { Box, IconButton, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { FC } from 'react';
import { z } from 'zod';
import { useStore } from '../../state';

const chatSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  model: z.string({ required_error: 'Provide a valid model name' }),
});
type ChatInputForm = z.infer<typeof chatSchema>;

interface ChatInputProps {
  placeholder?: string;
}

const ChatInput: FC<ChatInputProps> = ({
  placeholder = 'Let wisdom guide your words...',
}) => {
  const selectedModel = useStore.getState().selectedModel;
  const {
    formState: { isValid },
    handleSubmit,
    register,
    reset,
  } = useForm<ChatInputForm>({
    resolver: zodResolver(chatSchema),
    mode: 'onChange',
    defaultValues: {
      message: '',
      model: selectedModel,
    },
  });

  const onSubmit = (data: ChatInputForm): void => {
    console.log('Submitting: ', {
      message: data.message,
      model: selectedModel,
    });
    reset({ message: '', model: selectedModel });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        multiline
        minRows={2}
        maxRows={5}
        variant="standard"
        placeholder={placeholder}
        {...register('message')}
        slotProps={{
          input: {
            disableUnderline: true,
          },
        }}
        sx={{
          px: 2,
          pt: 2,
          pb: 1,
        }}
      />
      <Box
        pb={1}
        px={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0.5,
          }}
        >
          <IconButton disableRipple disableTouchRipple>
            <AttachFile fontSize="small" />
          </IconButton>
        </Box>
        <IconButton
          type="submit"
          disabled={!isValid}
          disableRipple
          disableTouchRipple
          sx={{
            backgroundColor: 'primary.light',
            color: 'HighlightText',
            '&:hover': { backgroundColor: 'primary.dark' },
            transition: 'background 0.1s ease-in-out',
          }}
        >
          <NearMe />
        </IconButton>
      </Box>
    </Box>
  );
};

export { ChatInput };
